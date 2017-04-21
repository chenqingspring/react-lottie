import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import Lottie from '../index';
import * as animationData from './pinjump.json'

const defaultOptions = {animationData: animationData};

storiesOf('Lottie Animation View', module)
  .add('Default', () => (
    <Lottie options={defaultOptions}/>
  )).add('Specify the size', () => (
  <Lottie options={defaultOptions} height={500} width={500}/>
));
