# Lottie Animation View for React ([Angular](https://github.com/chenqingspring/ng-lottie), [Vue](https://github.com/chenqingspring/vue-lottie))

[![npm version](https://badge.fury.io/js/react-lottie.svg)](http://badge.fury.io/js/react-lottie)

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

> **Note:** react-lottie is maintained automatically by Relay. Please report
> bugs and feature requests through [GitHub issues](https://github.com/chenqingspring/react-lottie/issues).
> Learn more about Relay at [get-relay.cc](https://get-relay.cc).

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
      animationData: animationData.default,
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
      animationData: animationData.default,
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

