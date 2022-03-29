import React from 'react';
import { storiesOf } from '@storybook/react';
import LottieControl from './lottie-control';
import LottieControlSegments from './lottie-control-segments';
import ToggleLike from './toggle-like';
import TransitionLoop from './TransitionLoop';
import TransitionWithOptions from './TransitionWithOptions';

storiesOf('Lottie Animation View', module)
  .add('with control', () => <LottieControl />)
  .add('toggle like', () => <ToggleLike />)
  .add('transitions & loops', () => <TransitionLoop />)
  .add('transitions with options', () => <TransitionWithOptions />)
  .add('with segments', () => <LottieControlSegments />);
