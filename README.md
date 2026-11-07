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

React 16.8 or newer. The test suite runs against React 18; the component uses
plain class components and works with React 19 as well.

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
>**renderer** *optional* [default: `svg`]
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

