# @crello/react-lottie

React/Typescript wrapper for awesome Aribnb's [lottie-web](https://github.com/airbnb/lottie-web) lib.

## Demo 
[https://crello.github.io/react-lottie/](https://crello.github.io/react-lottie/)

you can find demo files in `./examples` folder. run `yarn dev` to start

## Installation
`yarn add @crello/react-lottie` / `npm install --save @crello/react-lottie`

## Usage
Most basic react-lottie example:
```typescript
import React from 'react';
import { Lottie } from '@crello/react-lottie'
import { animationData } from './myAwesomeAnimation.json'

export const BasicLottieComponent = () => <Lottie config={{animationData: animationData}}>
```

Lottie component creates `<div>` and passes it to lottie config as the `container` param. This div contains renderer's output of choosen type: `'svg`| 'html' | 'canvas'`. `<Lottie>` accepts `style` and `className` props that will apply to the `container`. 

Any browser events to be added on elements wrapping actual `<Lottie>` e.g.:
```html
<div onClick={..}>
    <Lottie/>
<div>
```

## Params

### Props
```typescript
{
  height: string - valid css value e.g. '100px' [default: `100%`]
  width: string - valid css value e.g. '100px' [default: `100%`]
  playingState: 'playing' | 'stopped' | 'paused' [default: `playing`];
  segments: AnimationSegment | AnimationSegment[];
  speed: number - animation playback speed [default: `1`]
  style: styles passed to lottie container
  direction: AnimationDirection - [default: `1`]
  eventListeners: ReactLottieEvent[] - see available events in AnimationEventName from 'lottie-web'
  config: ReactLottieConfig - params
}
```

### Config
```typescript
{
  animationData: any - an Object with the exported animation data.
  renderer: 'svg' | 'canvas' | 'html' - choose renderer [default: `svg`]
  loop: boolean | number - loop boolean or count [default: `false`]
  autoplay: boolean - it will start playing as soon as it is ready [default: `true`]
  name: string - animation name for future reference;
  rendererSettings: SVGRendererConfig | CanvasRendererConfig | HTMLRendererConfig;
}
```

## More

See more details in @crello/react-lottie exports: `Lottie`, `ReactLottieConfig`, `ReactLottieOwnProps`, `ReactLottiePlayingState`

Also check out the types provided by [`lottie-web`](https://github.com/airbnb/lottie-web/blob/master/index.d.ts) itself: `AnimationDirection`, `AnimationSegment`, `AnimationEventName`, `AnimationEventCallback`, `AnimationItem`, `BaseRendererConfig`, `SVGRendererConfig`, `CanvasRendererConfig`, `HTMLRendererConfig`, `AnimationConfig`, `AnimationConfigWithPath`, `AnimationConfigWithData`, `Lottie`

More lottie animations you can find on [lottiefiles](https://www.lottiefiles.com/)

## License
MIT