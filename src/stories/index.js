import React from 'react';
import { storiesOf } from '@kadira/storybook';
import LottieControl from './lottie-control';
import LottieControlSegments from './lottie-control-segments';
import ToggleLike from './toggle-like';
import TransitionLoop from './TransitionLoop';
import TransitionWithOptions from './TransitionWithOptions';
import LottieGoToAndStop from './lottie-goToAndStop';
import LottieGoToAndPlay from './lottie-goToAndPlay';

storiesOf('Lottie Animation View', module)
  .add('with control', () => <LottieControl />)
  .add('toggle like', () => <ToggleLike />)
  .add('transitions & loops', () => <TransitionLoop />)
  .add('transitions with options', () => <TransitionWithOptions />)
  .add('with segments', () => <LottieControlSegments />)
  .add('with goToAndStop', () => <LottieGoToAndStop />)
  .add('with goToAndPlay', () => <LottieGoToAndPlay />);
