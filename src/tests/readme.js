import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

const { describe, it } = global;

// Issue #182: PR #180 injected "Live Demo" links pointing at jinno.io /
// jinno.app, a domain that redirects to a ransomware page. The links were
// reverted, but a README-only PR could slip them back in unnoticed.
// https://github.com/chenqingspring/react-lottie/issues/182
describe('README', () => {
  const readme = fs.readFileSync(path.join(__dirname, '../../README.md'), 'utf8');

  it('does not reference the malicious jinno demo domains', () => {
    expect(readme).to.not.match(/jinno\.(io|app)/i);
  });

  it('points the demo at the official GitHub Pages site', () => {
    expect(readme).to.contain('https://chenqingspring.github.io/react-lottie');
  });

  // Issue #155 (and the duplicate #139): "is this project still maintained?"
  // keeps coming back because the repo went quiet for years. The README opens
  // with the current status, so removing that line silently would revive the
  // question; keep it pinned.
  it('states that the project is actively maintained', () => {
    expect(readme).to.contain('This project is fully maintained automatically by');
    expect(readme).to.contain('[Relay](https://get-relay.cc)');
  });

  // Issue #39: `segments` shipped in #31 without any documentation.
  // https://github.com/chenqingspring/react-lottie/issues/39
  it('documents how to play a segment', () => {
    expect(readme).to.contain('### Play a segment');
    expect(readme).to.contain('segments={[45, 90]}');
  });

  // Issue #107: the container margin was hardcoded to `0 auto`, which broke in
  // some browsers. Expose it as a prop and keep it documented.
  it('documents the margin prop', () => {
    expect(readme).to.contain('**margin** *optional* [default: `0 auto`]');
    expect(readme).to.contain("margin=\"10px auto\"");
  });

  // Issue #110: clicking an animation pauses it, but the behaviour was only
  // discoverable in the props table, so users thought their animation had
  // broken. Keep the default behaviour, the opt-out and the wrapper-onClick
  // advice documented together.
  it('documents the default click-to-pause behaviour', () => {
    expect(readme).to.contain('### Click to pause');
    expect(readme).to.contain('isClickToPauseDisabled />');
    expect(readme).to.contain('<div onClick={() => openDetails()}>');
  });

  // Issue #106: users tried to pass a remote URL as `animationData`. A URL
  // belongs in `options.path`; keep that answer and its example documented.
  it('documents how to load animation data from a URL', () => {
    expect(readme).to.contain('### Loading animation data from a URL');
    expect(readme).to.contain("path: 'https://someurl.com/animationData.json'");
    expect(readme).to.contain('width="1293px"');
  });

  // Issue #142: a static JSON import inlines the animation into the JS bundle.
  // https://github.com/chenqingspring/react-lottie/issues/142
  it('documents how to avoid bundling large animation data', () => {
    expect(readme).to.contain('### Loading animation data without bloating the bundle');
    expect(readme).to.contain("path: '/animations/pinjump.json'");
    expect(readme).to.contain("import('./pinjump.json')");
  });

  // Issues #49 and #59: animations exported with bitmap layers reference files
  // from the JSON's `assets` array, and the relative `u`/`p` paths break once
  // the app is served from a sub-path. Keep the assetsPath and import advice.
  it('documents how to ship animations that reference raster images', () => {
    expect(readme).to.contain('### Animations with raster images');
    expect(readme).to.contain("assetsPath: '/animations/images/'");
    expect(readme).to.contain('"e": 0');
    expect(readme).to.contain("asset.id === 'image_0' ? { ...asset, u: '', p: img0 }");
  });

  // Issue #88: base64 images work; the `Invalid or unexpected token` error is
  // thrown while lottie-web evals an expression (an encoded @JSXBIN@ blob on
  // newer After Effects exports), not while decoding the image.
  it('explains the expression error that looks like a base64 image failure', () => {
    expect(readme).to.contain('### `Invalid or unexpected token` with embedded images');
    expect(readme).to.contain('@JSXBIN@');
    expect(readme).to.contain('Convert Expression to Keyframes');
  });

  // Issue #79: importing react-lottie pulls in the full lottie-web build, which
  // is large because it contains every renderer and the expression engine.
  it('documents how to shrink the lottie-web bundle', () => {
    expect(readme).to.contain('### Shrinking the lottie-web bundle');
    expect(readme).to.contain("'lottie-web': 'lottie-web/build/player/lottie_light.js'");
    expect(readme).to.contain('lottie_light_canvas.js');
  });

  // Issue #133: large animations drop frames on iOS regardless of browser
  // (all of them are WebKit there); keep the renderer/size advice documented.
  it('documents performance tuning for large animations on iOS', () => {
    expect(readme).to.contain('### Performance on iOS and low-end devices');
    expect(readme).to.contain("renderer: 'canvas'");
    expect(readme).to.contain('dpr: 1');
    expect(readme).to.contain('IntersectionObserver');
    expect(readme).to.contain('progressiveLoad');
  });

  // Issue #128: render one of several animations depending on the page.
  // Changing options.animationData reloads in place; a new object on every
  // render reloads every time, and a `key` forces a full remount.
  it('documents how to switch between several animations', () => {
    expect(readme).to.contain('### Switch between several animations');
    expect(readme).to.contain('animationData: animations[page]');
    expect(readme).to.contain('<Lottie key={page}');
  });

  // Issue #129: navigating back and forth in a Gatsby app accumulated animation
  // nodes. The default `div` container was nested in a `<p>`, which the browser
  // reparents while parsing server-rendered HTML; keep the navigation and
  // hydration advice documented.
  it('documents page navigation and the nested-container hydration trap', () => {
    expect(readme).to.contain('### Animations and page navigation');
    expect(readme).to.contain('validateDOMNesting');
    expect(readme).to.contain('<Lottie as="span" options={defaultOptions} />');
  });

  // Issue #17: importing the package outside a browser used to throw
  // "ReferenceError: window is not defined". Keep the SSR guidance pinned.
  it('documents server-side rendering', () => {
    expect(readme).to.contain('### Server-side rendering');
    expect(readme).to.contain('ReferenceError: window is not defined');
    expect(readme).to.contain("{ ssr: false }");
  });

  // Issue #117 asks for a hooks-only rewrite and points at react-lottie-player.
  // The answer is the "Hooks and alternatives" section: react-lottie keeps its
  // class/ref API, a function component can still drive it declaratively, and
  // hook-first users have three documented alternatives. Pin the section so the
  // answer cannot disappear from the README again.
  it('explains hooks usage and hook-first alternatives', () => {
    expect(readme).to.contain('## Hooks and alternatives');
    expect(readme).to.contain('https://github.com/mifi/react-lottie-player');
    expect(readme).to.contain('https://github.com/Gamote/lottie-react');
    expect(readme).to.contain('https://github.com/LottieFiles/lottie-react');
  });

  // Issue #112: users concluded the package was abandoned because it used the
  // componentWill* lifecycles React deprecated in 16.3 and stopped calling in
  // 17. They were replaced with componentDidUpdate in 2.0.0 (#77, #119); keep
  // the Requirements section saying so, and keep the regression test in
  // index.js pinned to the same promise.
  it('states that the deprecated React lifecycles are not used', () => {
    expect(readme).to.contain('componentDidMount');
    expect(readme).to.contain('componentWillUnmount');
    expect(readme).to.contain('componentWill*');
    expect(readme).to.contain('issues/119');
  });

  // Issue #135: the published entry point is CommonJS, so a plain <script>
  // tag fails with "exports is not defined"; document the ESM CDN path.
  it('documents how to use the package from a CDN without a bundler', () => {
    expect(readme).to.contain('## Using from a CDN (no bundler)');
    expect(readme).to.contain('exports is not defined');
    expect(readme).to.contain('https://esm.sh/react-lottie@2?external=react');
  });

  // Issue #111: Safari drops masks when a <base> tag changes how lottie-web's
  // `url(#id)` references resolve, and the fix is lottie.setLocationHref()
  // before the animation is generated. Keep it documented and pinned to the
  // option that applies it.
  it('documents the Safari mask fix', () => {
    expect(readme).to.contain('### Masks are missing in Safari');
    expect(readme).to.contain('locationHref: window.location.href');
    expect(readme).to.contain('lottie.setLocationHref(window.location.href)');
  });

  // Issue #98: `preserveAspectRatio` looked like it was not reaching the SVG.
  // It belongs inside `options`, not on `<Lottie />`, and `meet`/`slice` only
  // differ when the container's aspect ratio differs from the animation's.
  it('documents how to fit or crop an animation with preserveAspectRatio', () => {
    expect(readme).to.contain('### Fit or crop an animation (preserveAspectRatio)');
    expect(readme).to.contain("preserveAspectRatio: 'xMidYMid slice'");
    expect(readme).to.contain('A `rendererSettings` prop on `<Lottie />` itself is ignored');
    expect(readme).to.contain('height={200} width={400}');
  });

  // Guards the props table against drifting away from the component: every
  // prop in Lottie.propTypes must appear as a bold entry in the README.
  it('documents every prop the component accepts', () => {
    const source = fs.readFileSync(path.join(__dirname, '../index.js'), 'utf8');
    const propTypes = source.slice(source.indexOf('Lottie.propTypes'));
    const documented = propTypes.match(/^ {2}(\w+):/gm).map(line => line.trim().replace(':', ''));

    expect(documented).to.include('segments');

    const undocumented = documented.filter(prop => !readme.includes(`**${prop}**`));
    expect(undocumented).to.deep.equal([]);
  });
});
