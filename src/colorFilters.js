/* `colorFilters` mirrors lottie-react-native: every filter names a keypath in
   the animation (layer → group → shape item) and the color to replace there.
   lottie-web has no public API for recoloring a loaded animation, so the
   animation JSON is cloned with the matching colors replaced and the animation
   is loaded again. The caller's animationData is never mutated, because it may
   be a frozen ESM import (#144). */

const NAMED_COLORS = {
  aqua: [0, 255, 255],
  black: [0, 0, 0],
  blue: [0, 0, 255],
  cyan: [0, 255, 255],
  fuchsia: [255, 0, 255],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  grey: [128, 128, 128],
  lime: [0, 255, 0],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  navy: [0, 0, 128],
  olive: [128, 128, 0],
  purple: [128, 0, 128],
  red: [255, 0, 0],
  silver: [192, 192, 192],
  teal: [0, 128, 128],
  white: [255, 255, 255],
  yellow: [255, 255, 0],
};

const clampChannel = value => Math.min(255, Math.max(0, value));

const toFractions = channels => channels.map(channel => clampChannel(channel) / 255);

const parseHex = (value) => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value);
  if (!match) return null;

  const digits = match[1].length <= 4
    ? match[1].split('').map(digit => digit + digit)
    : match[1].match(/.{2}/g);

  /* The fourth value is alpha; lottie keeps the animation's own alpha, so it
     is ignored here. */
  return toFractions(digits.slice(0, 3).map(digit => parseInt(digit, 16)));
};

const parseChannel = (token) => {
  const value = parseFloat(token);
  if (Number.isNaN(value)) return null;
  return token.endsWith('%') ? (value * 255) / 100 : value;
};

const parseRgb = (value) => {
  const match = /^rgba?\(\s*([^)]+)\)$/i.exec(value);
  if (!match) return null;

  const channels = match[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3).map(parseChannel);
  if (channels.length !== 3 || channels.some(channel => channel === null)) return null;

  return toFractions(channels);
};

const hueToRgb = (p, q, t) => {
  let hue = t;
  if (hue < 0) hue += 1;
  if (hue > 1) hue -= 1;
  if (hue < 1 / 6) return p + (q - p) * 6 * hue;
  if (hue < 1 / 2) return q;
  if (hue < 2 / 3) return p + (q - p) * (2 / 3 - hue) * 6;
  return p;
};

const parseHsl = (value) => {
  const match = /^hsla?\(\s*([^)]+)\)$/i.exec(value);
  if (!match) return null;

  const parts = match[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;

  const hue = ((parseFloat(parts[0]) % 360) + 360) % 360 / 360;
  const saturation = parseFloat(parts[1]) / 100;
  const lightness = parseFloat(parts[2]) / 100;
  if (Number.isNaN(hue) || Number.isNaN(saturation) || Number.isNaN(lightness)) {
    return null;
  }

  if (saturation === 0) return [lightness, lightness, lightness];

  const q = lightness < 0.5
    ? lightness * (1 + saturation)
    : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  return [
    hueToRgb(p, q, hue + 1 / 3),
    hueToRgb(p, q, hue),
    hueToRgb(p, q, hue - 1 / 3),
  ];
};

/* Accepts the CSS color forms an app is likely to use for theming. Anything
   else (including CSS variables) is ignored rather than crashing the render. */
export const parseColor = (value) => {
  if (typeof value !== 'string') return null;

  const color = value.trim().toLowerCase();
  if (NAMED_COLORS[color]) return toFractions(NAMED_COLORS[color]);

  return parseHex(color) || parseRgb(color) || parseHsl(color);
};

const setColorArray = (target, color) => {
  if (!Array.isArray(target) || target.length < 3) return false;
  target[0] = color[0];
  target[1] = color[1];
  target[2] = color[2];
  return true;
};

/* A color property is either static (`k: [r, g, b, a]`) or animated
   (`k: [{ s: [...], e: [...] }, ...]`). Replace both so an animated fill stays
   recolored throughout its keyframes. */
const setColorProperty = (property, color) => {
  if (!property || !Array.isArray(property.k) || property.k.length === 0) return false;

  if (typeof property.k[0] === 'number') {
    return setColorArray(property.k, color);
  }

  let applied = false;
  property.k.forEach((keyframe) => {
    if (!keyframe || typeof keyframe !== 'object') return;
    if (setColorArray(keyframe.s, color)) applied = true;
    if (setColorArray(keyframe.e, color)) applied = true;
  });
  return applied;
};

const toHex = (color) => `#${color
  .map(channel => Math.round(channel * 255).toString(16).padStart(2, '0'))
  .join('')}`;

/* Solid layers store their color as a hex string instead of a color array. */
const setSolidColor = (layer, color) => {
  if (typeof layer.sc === 'string') {
    layer.sc = toHex(color);
    return true;
  }
  return setColorArray(layer.sc, color);
};

/* Split on unescaped dots so layer names that contain a dot (`icon.dark`) can
   be targeted with `icon\.dark`. */
const splitKeypath = (keypath) => {
  const parts = [];
  let current = '';

  for (let index = 0; index < keypath.length; index += 1) {
    const character = keypath[index];
    if (character === '\\' && index + 1 < keypath.length) {
      current += keypath[index + 1];
      index += 1;
    } else if (character === '.') {
      parts.push(current);
      current = '';
    } else {
      current += character;
    }
  }

  parts.push(current);
  return parts;
};

/* `*` matches one level and `**` matches any number of levels, matching the
   keypath conventions used by lottie-ios. */
const matchesKeypath = (pattern, path) => {
  if (pattern.length === 0) return path.length === 0;

  if (pattern[0] === '**') {
    for (let index = 0; index <= path.length; index += 1) {
      if (matchesKeypath(pattern.slice(1), path.slice(index))) return true;
    }
    return false;
  }

  if (path.length === 0) return false;
  if (pattern[0] !== '*' && pattern[0] !== path[0]) return false;

  return matchesKeypath(pattern.slice(1), path.slice(1));
};

export const colorFiltersAreEqual = (first, second) => {
  if (first === second) return true;
  if (!Array.isArray(first) || !Array.isArray(second) || first.length !== second.length) {
    return false;
  }

  return first.every((filter, index) => {
    const other = second[index];
    return Boolean(filter && other)
      && filter.keypath === other.keypath
      && filter.color === other.color;
  });
};

export const applyColorFilters = (animationData, colorFilters) => {
  if (!animationData || !Array.isArray(colorFilters) || colorFilters.length === 0) {
    return animationData;
  }

  const filters = colorFilters
    .filter(filter => filter && typeof filter.keypath === 'string')
    .map(filter => ({
      parts: splitKeypath(filter.keypath.trim()),
      color: parseColor(filter.color),
    }))
    .filter(filter => filter.color);

  if (filters.length === 0) return animationData;

  const data = JSON.parse(JSON.stringify(animationData));
  const assets = new Map();
  if (Array.isArray(data.assets)) {
    data.assets.forEach((asset) => {
      if (asset && asset.id) assets.set(asset.id, asset);
    });
  }
  let applied = false;

  const recolor = (node, path) => {
    filters.forEach((filter) => {
      if (!matchesKeypath(filter.parts, path)) return;

      if (node.c && setColorProperty(node.c, filter.color)) applied = true;
      if (node.ty === 1 && setSolidColor(node, filter.color)) applied = true;
    });
  };

  const walkShapes = (shapes, path) => {
    if (!Array.isArray(shapes)) return;

    shapes.forEach((shape) => {
      if (!shape || typeof shape !== 'object') return;

      const shapePath = shape.nm ? [...path, shape.nm] : path;
      recolor(shape, shapePath);
      walkShapes(shape.it, shapePath);
      walkShapes(shape.shapes, shapePath);
    });
  };

  /* Precompositions are walked twice: once from the asset (so a keypath can
     start at the inner layer name) and once from each layer that references
     them (so `Precomp.InnerLayer...` also works). `refStack` prevents a
     self-referencing composition from recursing forever. */
  const walkLayers = (layers, prefix, refStack) => {
    if (!Array.isArray(layers)) return;

    layers.forEach((layer) => {
      if (!layer || typeof layer !== 'object') return;

      const path = layer.nm ? [...prefix, layer.nm] : prefix;
      recolor(layer, path);
      walkShapes(layer.shapes, path);

      const asset = layer.refId ? assets.get(layer.refId) : null;
      if (layer.ty === 0 && asset && !refStack.includes(layer.refId)) {
        walkLayers(asset.layers, path, [...refStack, layer.refId]);
      }
    });
  };

  walkLayers(data.layers, [], []);
  if (Array.isArray(data.assets)) {
    data.assets.forEach(asset => walkLayers(asset.layers, [], []));
  }

  return applied ? data : animationData;
};
