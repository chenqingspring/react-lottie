import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import LottieControl from './lottie-control'

storiesOf('Lottie Animation View', module)
  .add('with control', () => (
    <LottieControl/>
  ));
