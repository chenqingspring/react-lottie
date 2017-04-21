import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import Lottie from '../index';
import * as animationData from './pinjump.json'

const options = {animationData: animationData};

storiesOf('Lottie Animation View', module)
  .add('default', () => (
    <Lottie options={options}/>
  ));
