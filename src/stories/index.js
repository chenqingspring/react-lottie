import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import Lottie from '../index';
import * as animationData from './pinjump.json'
import LottieControl from './lottie-control'

const defaultOptions = {animationData: animationData};

storiesOf('Lottie Animation View', module)
  .add('specify animation options & size', () => (
    <Lottie options={defaultOptions} height={500} width={500}/>
  )).add('control animation', () => (
  <LottieControl/>
));
