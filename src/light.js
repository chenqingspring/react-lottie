import React from 'react';
import lottieLight from 'lottie-web/build/player/lottie_light';
import Component from './component';

export default function (props) {
  return <Component lottie={lottieLight} {...props} />;
}
