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

## TypeScript

Type definitions are maintained on DefinitelyTyped and track this package's
props. Install them alongside the package:

```
npm install --save-dev @types/react-lottie
```

TypeScript picks the declarations up automatically, so no import changes are
needed.

## Usage

Import pinjump.json as animation data

```jsx
import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from './pinjump.json'

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
import * as animationData from './pinjump.json'

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

