import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import LottieControl from './lottie-control';
import ToggleLike from './toggle-like';
import TransitionLoop from './TransitionLoop';
import TransitionWithOptions from './TransitionWithOptions';

storiesOf('Lottie Animation View', module)
  .add('with control', () => <LottieControl />)
  .add('toggle like', () => <ToggleLike />)
  .add('transitions & loops', () => <TransitionLoop />)
  .add('transitions with options', () => <TransitionWithOptions />);
