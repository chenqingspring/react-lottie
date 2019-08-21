import React from 'react';
import lottie from 'lottie-web';
import Component from './component';

export default function (props) {
  return <Component lottie={lottie} {...props} />;
}
