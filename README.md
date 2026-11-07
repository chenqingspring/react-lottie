# Lottie Animation View for React ([Angular](https://github.com/chenqingspring/ng-lottie), [Vue](https://github.com/chenqingspring/vue-lottie))

[![npm version](https://badge.fury.io/js/react-lottie.svg)](http://badge.fury.io/js/react-lottie)

> **This project is fully maintained automatically by [Relay](https://get-relay.cc).**

## Demo
https://chenqingspring.github.io/react-lottie

## Wrapper of lottie-web

[lottie-web](https://github.com/airbnb/lottie-web) (previously Bodymovin) is an [Adobe After Effects](http://www.adobe.com/products/aftereffects.html) plugin for exporting animations as JSON. It also provides the player that renders them as svg/canvas/html.

## Why Lottie?

#### Flexible After Effects features
We currently support solids, shape layers, masks, alpha mattes, trim paths, and dash patterns. And we’ll be adding new features on a regular basis.

#### Manipulate your animation any way you like
You can go forward, backward, and most importantly you can program your animation to respond to any interaction.

#### Small file sizes
Bundle vector animations within your app without having to worry about multiple dimensions or large file sizes. Alternatively, you can decouple animation files from your app’s code entirely by loading them from a JSON API.

[Learn more](http://airbnb.design/introducing-lottie/) › http://airbnb.design/lottie/

Looking for lottie files › https://www.lottiefiles.com/

## Installation

Install through npm:
```
npm install --save react-lottie
```

> **Note:** Found a bug or have a feature request? Open an issue on
> [GitHub](https://github.com/chenqingspring/react-lottie/issues) and Relay
> will review and fix it.

## Using from a CDN (no bundler)

The published `dist/index.js` is a CommonJS build for bundlers and npm
consumers. It uses `exports` and expects `react`, `prop-types` and `lottie-web`
to be resolvable, so loading that file with a plain `<script>` tag fails with
`Uncaught ReferenceError: exports is not defined`. The package does not ship a
UMD/browser global build.

To use react-lottie without a build step, load it as an ES module from a CDN
and map `react` to the same copy the page uses. [esm.sh](https://esm.sh)
supports `?external=react` for exactly this:

```html
<script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18",
      "react-dom/client": "https://esm.sh/react-dom@18/client",
      "react-lottie": "https://esm.sh/react-lottie@2?external=react"
    }
  }
</script>
<script type="module">
  import React from 'react';
  import { createRoot } from 'react-dom/client';
  import Lottie from 'react-lottie';

  const options = {
    path: '/animations/pinjump.json',
    loop: true,
    autoplay: true,
  };

  createRoot(document.getElementById('root')).render(
    React.createElement(Lottie, { options, height: 400, width: 400 })
  );
</script>
```

Without a compiler for JSX, create elements with `React.createElement`, or add
`htm`/Babel. Keeping `react` in the import map gives the page one React
instance; a CDN build that bundles its own React (such as jsDelivr's `+esm`
output) produces two copies, which breaks context and hooks.

If you only need to play an animation and not the React wrapper, load
lottie-web directly and skip React entirely:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
<script>
  lottie.loadAnimation({
    container: document.getElementById('root'),
    path: '/animations/pinjump.json',
    renderer: 'svg',
    loop: true,
    autoplay: true,
  });
</script>
```

An ESM CDN build still downloads React, React DOM, lottie-web and react-lottie,
so it removes the build step but not the bytes. For production, a bundler that
shares one React copy and tree-shakes lottie-web is smaller.

## Requirements

React 16.8 or newer, including React 17, React 18 and React 19. The
`react: ">=16.8.0"` peer dependency resolves without `--legacy-peer-deps` or
`--force`. The test suite runs against React 18; the component uses plain class
components and works with React 17 and React 19 as well.

## Local development

Run the Storybook stories with `npm start` (port 9010) and the test suite with
`npm test`.

## TypeScript

Type definitions are maintained on DefinitelyTyped and track this package's
props. Install them alongside the package:

```
npm install --save-dev @types/react-lottie
```

TypeScript picks the declarations up automatically, so no import changes are
needed.

## Testing

`lottie-web` probes canvas support when it is imported, so a jsdom-based test
runner needs a canvas implementation before the component is loaded. With Jest
(the default for Create React App), add [`jest-canvas-mock`](https://github.com/hustcc/jest-canvas-mock)
to your setup file:

```javascript
import 'jest-canvas-mock';
```

## Usage

Import pinjump.json as animation data

```jsx
import React from 'react'
import Lottie from 'react-lottie';
import animationData from './pinjump.json'

export default class LottieControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isStopped: false, isPaused: false};
  }

  render() {
    const buttonStyle = {
      display: 'block',
      margin: '10px auto'
    };

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return <div>
      <Lottie options={defaultOptions}
              height={400}
              width={400}
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>
      <button style={buttonStyle} onClick={() => this.setState({isStopped: true})}>stop</button>
      <button style={buttonStyle} onClick={() => this.setState({isStopped: false})}>play</button>
      <button style={buttonStyle} onClick={() => this.setState({isPaused: !this.state.isPaused})}>pause</button>
    </div>
  }
}

```

Pass the parsed animation object as `options.animationData`. A file path or URL
belongs in `options.path`; a namespace import
(`import * as animationData`) is unwrapped automatically but the default import
above is preferred.

### Loading animation data without bloating the bundle

A static import like `import animationData from './pinjump.json'` (the example
above) makes the bundler inline the animation into the JavaScript chunk that
imports it. A 500 kB JSON file then becomes 500 kB of JavaScript the browser has
to download and parse before the page can run. The JSON is data, not code, so
keep it out of the main bundle:

**Serve it from `public/` and use `options.path`.** In Create React App, Vite
and Next.js, files in `public/` are copied to the build output as static
assets; they are not bundled into JavaScript. `lottie-web` fetches the file when
the component mounts, and the browser caches it separately from the app bundle:

```jsx
const defaultOptions = {
  path: '/animations/pinjump.json', // relative to the deployed site root
  loop: true,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

<Lottie options={defaultOptions} height={400} width={400} />
```

Because lottie-web owns the fetch, `colorFilters` is not applied to animations
loaded this way — fetch the JSON yourself if you need to recolor it.

**Or load it on demand with a dynamic `import()`.** If you need the parsed data
in your own code, a dynamic import puts the JSON in a separate chunk that is
downloaded only when the component renders:

```jsx
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

export default function Animation() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    import('./pinjump.json').then(({ default: data }) => {
      if (!cancelled) setAnimationData(data);
    });
    return () => { cancelled = true; };
  }, []);

  if (!animationData) return null;

  return (
    <Lottie
      options={{ animationData, loop: true, autoplay: true }}
      height={400}
      width={400}
    />
  );
}
```

Rendering `<Animation />` lazily (for example when it scrolls into view) defers
even that chunk until it is needed. The same idea works with `React.lazy` around
a component that imports the JSON.

Finally, the file itself can usually get smaller: export at a lower precision,
remove unused layers and precompositions, avoid embedded raster images, and let
gzip/Brotli compress the JSON. LottieFiles' optimizer automates the first steps.

### Animations with raster images

An After Effects export that contains bitmap layers references those files from
the animation's `assets` array. Each entry carries a directory (`u`), a file name
(`p`) and an embedded flag (`e`):

```json
{ "id": "image_0", "w": 720, "h": 720, "u": "images/", "p": "img_0.png", "e": 0 }
```

With `"e": 0` lottie-web loads the file separately and resolves `u + p` relative
to the page, which breaks as soon as the app is served from a sub-path or
navigates client-side. Set `options.assetsPath` to the directory where the
images are deployed instead; react-lottie forwards unknown options to
lottie-web:

```jsx
const defaultOptions = {
  path: '/animations/cypher.json',
  assetsPath: '/animations/images/', // trailing slash required
  loop: true,
  autoplay: true,
};

<Lottie options={defaultOptions} height={400} width={400} />
```

Copy the images next to the JSON in `public/animations/images/` so they are
served as static files instead of being bundled. `assetsPath` works with both
`path` and `animationData`, and it applies to every image in the animation.

If you want the bundler to hash and inline the images, import them yourself and
rewrite the asset entries before passing the data. Don't mutate the imported
JSON in place when it is a frozen ESM object:

```jsx
import img0 from './images/img_0.png';
import animationData from './cypher.json';

const data = {
  ...animationData,
  assets: animationData.assets.map((asset) => (
    asset.id === 'image_0' ? { ...asset, u: '', p: img0 } : asset
  )),
};

<Lottie options={{ animationData: data, loop: true, autoplay: true }} />
```

`"e": 1` means the image is embedded in the JSON as a base64 data URI. That
keeps the animation self-contained, but it inflates the file by roughly a third
and prevents the browser from caching the image separately, so prefer external
images for anything large.

### Shrinking the lottie-web bundle

react-lottie imports the full `lottie-web` player (299 kB minified, 611 kB
unminified in lottie-web 5.13), which includes the expression engine and every
renderer. If your animations don't use expressions and you only need one
renderer, alias `lottie-web` to a smaller build; react-lottie keeps working
because those builds expose the same `loadAnimation` API.

Vite:

```js
// vite.config.js
export default defineConfig({
  resolve: {
    alias: {
      'lottie-web': 'lottie-web/build/player/lottie_light.js',
    },
  },
});
```

webpack (Create React App, Next.js):

```js
// next.config.js
module.exports = {
  webpack(config) {
    config.resolve.alias['lottie-web'] = require.resolve(
      'lottie-web/build/player/lottie_light.js'
    );
    return config;
  },
};
```

The light builds are about 45% smaller (164 kB vs 299 kB minified):

* `lottie_light.js` — SVG renderer only, no expressions; shapes and raster
  images still work.
* `lottie_light_canvas.js` — canvas renderer only, no expressions.
* `lottie_light_html.js` — HTML renderer only, no expressions.

Pick the build that matches `options.renderer`: `lottie_light` only registers
the SVG renderer, so pass `renderer: 'svg'` (the default); use
`lottie_light_canvas` with `renderer: 'canvas'`. Don't alias when an animation
uses expressions or effects, because the light builds silently skip them.

### Performance on iOS and low-end devices

File size mostly affects how long an animation takes to download and parse, not
its frame rate. Once playback starts, the cost of each frame comes from what the
renderer has to draw: the number of layers and shapes, masks and mattes,
expressions, effects, and the pixel size of the canvas. A multi-megabyte export
is a good signal that there is a lot of that (issue #133).

On iOS 14.5, Safari, Chrome and Firefox all run on WebKit, so they render at the
same speed; measuring in Safari is representative. Phones are also much slower
than a desktop, so an animation that is smooth on a laptop can drop frames on
mobile.

In rough order of impact:

1. **Reduce the animation.** Remove hidden and unused layers, flatten
   precompositions, simplify masks and mattes, drop expressions and effects, and
   avoid embedded raster images. If one scene is still heavy, split it into
   smaller files and play only the needed range with `segments`.
2. **Draw it at the size it is displayed.** `width` and `height` set the
   container size; rendering a 1200 px animation into a 300 px slot does more
   work than necessary. With the canvas renderer, also cap the backing-store
   resolution: at a device pixel ratio of 3, a 400 px canvas is rasterized at
   1200 px unless you set `dpr`.
3. **Compare the renderers.** `svg` (the default) is usually fastest for a few
   large shapes and stays crisp at any size. `canvas` avoids updating hundreds
   of DOM nodes and often wins for animations with many small shapes. Measure
   both on the target device.
4. **Stop off-screen animations.** lottie-web drives every playing animation
   from the same `requestAnimationFrame` loop, so an animation scrolled out of
   view still costs a frame. Pause it with `isPaused`, or with `pause()` on a
   `ref`, driven by an `IntersectionObserver`.

```jsx
const defaultOptions = {
  animationData,
  loop: true,
  autoplay: true,
  renderer: 'canvas',
  rendererSettings: {
    dpr: 1, // render at CSS resolution; use 2 for a sharper middle ground
  },
};

<Lottie options={defaultOptions} height={300} width={300} />
```

For the default `svg` renderer, `rendererSettings.progressiveLoad` builds the
layers over several frames instead of blocking on the first one. It does not
wait for the element to scroll into view; pause off-screen animations yourself:

```jsx
// `visible` is kept up to date by an IntersectionObserver on a wrapper element.
<Lottie
  options={{ animationData, loop: true, autoplay: false, rendererSettings: { progressiveLoad: true } }}
  isPaused={!visible}
/>
```

If a reduced file still drops frames, profile it: record a timeline in Safari's
Web Inspector while the animation plays and check whether the time goes to
lottie-web's frame update or to the browser painting and compositing the layers.

### Play on hover

`eventListeners` takes lottie-web animation events (`complete`, `loopComplete`,
`enterFrame`, ...), not DOM events. Registering `onMouseOver` or `onMouseLeave`
there will never fire. Put the DOM handlers on a wrapper element and drive the
component with props instead.

To play forward on hover and reverse from the current frame on leave, keep the
animation running and flip `direction`. `isStopped` resets the animation to its
first frame, so only use it once, to start from a known state.

```jsx
import React from 'react'
import Lottie from 'react-lottie';
import animationData from './pinjump.json'

export default class HoverLottie extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isStopped: true, direction: 1};
  }

  render() {
    const defaultOptions = {
      loop: false,
      autoplay: false,
      animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return <div
      onMouseEnter={() => this.setState({isStopped: false, direction: 1})}
      onMouseLeave={() => this.setState({direction: -1})}>
      <Lottie options={defaultOptions}
              height={100}
              width={100}
              isStopped={this.state.isStopped}
              direction={this.state.direction}
              isClickToPauseDisabled />
    </div>
  }
}

```

### Play a segment

Pass `segments` to play a frame range instead of the whole animation. The
frames are the ones shown in After Effects / the lottie editor.

```jsx
<Lottie options={defaultOptions}
        height={400}
        width={400}
        segments={[45, 90]} />
```

Changing `segments` while the animation is running restarts playback from the
new `fromFrame`, so a single state value is enough to switch ranges:

```jsx
<Lottie options={defaultOptions} segments={this.state.segment} />
```

A segment also has to be reachable with `loop`/`autoplay` as usual: with
`loop: false` and `autoplay: false` the range only plays once you flip
`isStopped` or pass a new `segments` value.

### Recolor an animation

`colorFilters` replaces the colors of fills, strokes and solid layers named by
a keypath, so one animation file can follow a theme (issue #144):

```jsx
<Lottie
  options={defaultOptions}
  colorFilters={[
    { keypath: 'Pin 1.Shape 2.Fill 1', color: '#4f46e5' },
    { keypath: 'Background', color: 'rgb(15, 23, 42)' },
  ]}
/>
```

A keypath is the dot-separated name chain from the layer down to the fill,
stroke or solid, e.g. `layer.group.fill`. For a layer inside a precomposition,
the composition name can be included (`Precomp.InnerLayer.Shape.Fill 1`) or
omitted. `*` matches one level and `**` matches any number of levels; dots in
a name can be escaped with a backslash. Colors accept hex, `rgb()`/`rgba()`,
`hsl()`/`hsla()` and the basic CSS color names. Invalid filters are ignored.

The filters are applied to `options.animationData`. Changing them reloads the
animation, because lottie-web cannot recolor a loaded animation; the current
frame and paused/playing state are preserved. Animations loaded from
`options.path` are not recolored, since the JSON is fetched by lottie-web:
load the JSON yourself and pass it as `animationData` instead.

### Render inline inside a paragraph

The container is a `div` by default, which is not a valid child of `<p>`. Pass
`as` to choose the element (issue #73):

```jsx
<p>
  Text <Lottie as="span" options={defaultOptions} ariaRole="img" /> more text
</p>
```

`as` accepts a tag name or a component that forwards its `ref` to the DOM node
lottie-web should render into. Changing `as` reloads the animation into the new
element and keeps the current frame.

### Switch between several animations

Each `<Lottie>` owns one lottie-web instance, so an app can render two
animations side by side or keep one animation per page. To choose which one is
shown, keep the animation data in a map and pass the entry for the current page
as `options.animationData` (issue #128):

```jsx
import homeData from './animations/home.json';
import aboutData from './animations/about.json';

const animations = { home: homeData, about: aboutData };

const PageAnimation = ({ page }) => (
  <Lottie
    options={{
      loop: true,
      autoplay: true,
      animationData: animations[page],
    }}
    height={300}
    width={300}
  />
);
```

Changing `options.animationData` reloads the animation into the same container,
so a `key` is not required. Keep the JSON modules stable: copying the data in
`render` (`animationData: { ...animations[page] }`) hands the component a new
object on every render and reloads the animation each time. If you do want to
start over — to replay an intro, for example — give the component a `key` so
React unmounts and remounts it:

```jsx
<Lottie key={page} options={{ ...defaultOptions, animationData: animations[page] }} />
```

Unmounting destroys the lottie-web instance, so only the visible page animates.
When the files are large, load them with `options.path` and fetch the JSON for
the next page ahead of time instead of shipping every animation in one bundle;
see [Loading animation data without bloating the bundle](#loading-animation-data-without-bloating-the-bundle).

### Server-side rendering

`<Lottie />` renders only a sized container element on the server; lottie-web is
imported but instantiated in `componentDidMount` only, so `renderToString` (and
Next.js/Gatsby prerendering) works and the animation starts after hydration:

```jsx
// server output: <div style="width:400px;height:400px;..."></div>
<Lottie options={defaultOptions} height={400} width={400} />
```

Importing the package outside a browser no longer throws
`ReferenceError: window is not defined`; lottie-web guards its DOM access at
module load. If your bundler still evaluates the player on the server, load the
component without SSR:

```jsx
// Next.js
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });
```

Animations loaded from `options.path` are fetched by lottie-web after mount, so
nothing is requested during the server render. Avoid the hydration trap
described in [Animations and page navigation](#animations-and-page-navigation)
when the container is nested in a `<p>`.

### Animations and page navigation

react-lottie creates a lottie-web instance when the component mounts and calls
`destroy()` on unmount, so client-side navigation is safe as long as the page
really unmounts. A layout that renders every page at once (or keeps pages
mounted when switching tabs) keeps every animation running; mount only the
visible one.

One non-obvious trap on SSR frameworks such as Gatsby or Next.js: the wrapper is
a `div` by default, and a `div` inside a `p` is invalid HTML. The browser moves
the `div` out of the paragraph while parsing the server-rendered page, React
reports a hydration mismatch (`validateDOMNesting`), and the animation node ends
up outside the page subtree. Navigating back and forth can then leave animation
nodes behind. Render the animation with `as="span"` (issue #73) or move it
outside the paragraph:

```jsx
<p>
  Text <Lottie as="span" options={defaultOptions} /> more text
</p>
```

If animations still accumulate, confirm that each page unmounts (React DevTools
shows the component tree changing), and pause off-screen instances as described
in [Performance on iOS and low-end devices](#performance-on-ios-and-low-end-devices).

### Imperative control

A `ref` to the component exposes `play()`, `pause()`, `stop()`,
`playSegments()`, `goToAndStop(frame, isFrame)` and
`goToAndPlay(frame, isFrame)`, mirroring the lottie-web animation object. Use
`isFrame: true` for a frame number, or omit it to pass a time in seconds. This
is how you can sync an animation to scroll position (issue #40):

```jsx
const lottie = useRef(null);

const onScroll = (frame) => lottie.current.goToAndStop(frame, true);

<Lottie ref={lottie} options={defaultOptions} />
```

### props
The `<Lottie />` Component supports the following props:

**options** *required*

the object representing the animation settings that will be instantiated by bodymovin. Currently a subset of the bodymovin options are supported:

>**loop** *options* [default: `false`]
>
>**autoplay** *options* [default: `false`]
>
>**animationData** *optional* — the exported animation data. Mutually exclusive with `path`.
>
>**path** *optional* — a URL (or path) to a JSON animation file. Mutually exclusive with `animationData`.
>
>**renderer** *optional* [default: `svg`] — `svg`, `canvas` or `html`. See [Performance on iOS and low-end devices](#performance-on-ios-and-low-end-devices).
>
>**rendererSettings** *required* 

**colorFilters** *optional* [default: `[]`]

Array of `{ keypath, color }` objects that replace the colors of fills,
strokes and solid layers. See [Recolor an animation](#recolor-an-animation).

**width** *optional* [default: `100%`]

pixel value for containers width.

**height** *optional* [default: `100%`]

pixel value for containers height.

**isStopped** *optional* [default: `false`]

Stops the animation and resets it to the first frame. Setting it back to `false`
resumes playback. Unlike `isPaused`, this discards the current position.

**isPaused** *optional* [default: `false`]

Pauses the animation without losing its current frame. Setting it back to
`false` resumes from where it stopped.

**speed** *optional* [default: `1`]

Playback rate. `2` plays twice as fast, `0.5` at half speed, and negative
values play in reverse at that rate.

**direction** *optional* [default: `1`]

`1` plays forward, `-1` plays backward. Changing it keeps the current frame,
which is what you want for hover-in / hover-out effects.

**isSubframe** *optional* [default: `true`]

Passed to lottie-web's `setSubframe()`. When `true`, frames are interpolated
for smooth playback. Set it to `false` to make the `enterFrame` event fire only
on whole After Effects frames, for example to trigger audio exactly on frame
boundaries (issue #71).

**segments** *optional* [default: none]

`[fromFrame, toFrame]` to play only part of the animation, e.g. `[45, 90]`.
The range is applied as soon as the prop is set and re-applied whenever it
changes, so a new value starts playing that segment immediately even while the
animation is running. See [Play a segment](#play-a-segment).

**eventListeners** *optional* [default: `[]`]

This is an array of objects containing a `eventName` and `callback` function that will be registered as  eventlisteners on the animation object. refer to [bodymovin#events](https://github.com/bodymovin/bodymovin#events) where the mention using addEventListener, for a list of available custom events. These are lottie-web animation events, not DOM events: for `onMouseOver`, `onMouseLeave` and friends put the handler on a wrapping element, as shown in [Play on hover](#play-on-hover).

example:
```jsx
eventListeners=[
  {
    eventName: 'complete',
    callback: () => console.log('the animation completed:'),
  },
]
```

**isClickToPauseDisabled** *optional* [default: `false`]
When this props is left unspecified or is set to `false` animations are paused or resumed when a user clicks or taps them. If you do not want this behaviour set this prop to `true`.

**ariaRole** *optional* [default: `button`]

Role of the rendered container. Pass `img` for a purely decorative animation
that is described by `ariaLabel`.

**ariaLabel** *optional* [default: `animation`]

Accessible name of the container.

**title** *optional* [default: `''`]

`title` attribute (native tooltip) of the container.

**style** *optional*

Extra inline styles merged onto the container, after the `width`, `height` and
layout defaults. Use it to override `overflow` or `margin`.

**tabIndex** *optional* [default: `0`]
Tab order of the rendered container. Pass `-1` for a purely presentational
animation that should not receive keyboard focus.

**as** *optional* [default: `div`]

Element or component rendered as the animation container. Use `as="span"` when
`<Lottie />` is a child of `<p>`, where a `div` is invalid HTML (issue #73). A
custom component must forward its `ref` to a DOM element. See
[Render inline inside a paragraph](#render-inline-inside-a-paragraph).

## Related Projects

* [lottie-web](https://github.com/airbnb/lottie-web) react-lottie is a wrapper of lottie-web
* [Angular Lottie](https://github.com/chenqingspring/ng-lottie) angular implementation
* [Vue Lottie](https://github.com/chenqingspring/vue-lottie) vue implementation
* [React Native Lottie](https://github.com/airbnb/lottie-react-native) react native implementation by airbnb
* [IOS Lottie](https://github.com/airbnb/lottie-ios) ios implementation by airbnb
* [Android Lottie](https://github.com/airbnb/lottie-android) android implementation by airbnb

## Contribution
Your contributions and suggestions are heartily welcome.

## License
MIT

