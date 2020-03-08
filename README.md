# Lottie Animation View Wrapper for React

## Demo
https://github.com/donovanclarke/react-lottie

## Wapper of bodymovin.js

[bodymovin](https://github.com/bodymovin/bodymovin) is [Adobe After Effects](http://www.adobe.com/products/aftereffects.html) plugin for exporting animations as JSON, also it provide bodymovin.js for render them as svg/canvas/html.

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
npm install --save react-lottie-wrapper
```

## Usage

Import pinjump.json.json as animation data

```jsx
import React, { Component } from "react"
import Lottie from "react-lottie-wrapper";
import * as animationData from "./pinjump.json"

export default class LottieControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStopped: false,
      isPaused: false
    };
  }

  render() {
    const buttonStyle = {
      display: "block",
      margin: "10px auto"
    };

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    return (
      <>
        <Lottie 
          options={defaultOptions}
          height={400}
          width={400}
          isStopped={this.state.isStopped}
          isPaused={this.state.isPaused}
        />
        <button style={buttonStyle} onClick={() => this.setState({isStopped: true})}>stop</button>
        <button style={buttonStyle} onClick={() => this.setState({isStopped: false})}>play</button>
        <button style={buttonStyle} onClick={() => this.setState({isPaused: !this.state.isPaused})}>pause</button>
      </>
    )
  }
}

```

### props
The `<Lottie />` Component supports the following properties:

**options** *required*

the object representing the animation settings that will be instantiated by bodymovin. Currently a subset of the bodymovin options are supported:

**animationData** *required*

**rendererSettings** *required* 

**styles** *optional* [default: `{{height: 100%, width: 100%, outline: none}}`]

Insert inline styling for container.

**className** *optional* [default: `""`]

Insert class name for container.

**loop** *optional* [default: `false`]

Should animation loop.

**autoplay** *optional* [default: `false`]

Should animation begin to play automatically.

**isClickToPauseDisabled** *optional* [default: `false`]

Disables click event to pause the animation.

**isStopped** *optional* [default: `false`]

Handler to stop the animation.

**isPaused** *optional* [default: `false`]

Handler to pause the animation.

**width** *optional* [default: `100%`]

Pixel value for containers width.

**height** *optional* [default: `100%`]

Pixel value for containers height.

**speed** *optional* [default: `1`]

Set the speed of the animation (`normal === 1`).

**ariaRole** *optional* [default: `button`]

**ariaLabel** *optional* [default: `animation`]

**title** *optional* [default: `""`]

**eventListeners** *optional* [default: `[]`]

This is an array of objects containing a `eventName` and `callback` function that will be registered as  eventlisteners on the animation object. refer to [bodymovin#events](https://github.com/bodymovin/bodymovin#events) where the mention using addEventListener, for a list of available custom events.

example:
```jsx
eventListeners=[
  {
    eventName: 'complete',
    callback: () => console.log('the animation completed:'),
  },
]
```

## Related Projects

* [Bodymovin](https://github.com/bodymovin/bodymovin) react-lottie is a wrapper of bodymovin
* [React Native Lottie](https://github.com/airbnb/lottie-react-native) react native implementation by airbnb
* [IOS Lottie](https://github.com/airbnb/lottie-ios) ios implementation by airbnb
* [Android Lottie](https://github.com/airbnb/lottie-android) android implementation by airbnb

## Contribution
Your contributions and suggestions are heartily welcome.

## License
MIT

