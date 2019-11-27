import { AnimationDirection } from 'lottie-web';
import React, { useState } from 'react';
import cs from 'classnames';
import CSS from 'csstype';

import { Lottie, ReactLottieConfig } from './reactComponentLib';
import animationData from './lotties/11643-tesla-cybertruck.json'

export const LottieHoverable = () => {
  const [direction, setDirection] = useState<AnimationDirection>(1);
  const [speed, setSpeed] = useState<number>(2);
  const handleLottieMouseEnter = () => {
    setSpeed(0.25);
  };
  const handleLottieMouseLeave = () => {
    setSpeed(2);
    setDirection(direction > 0 ? -1 : 1);
  };
  const reactLottieConfig: ReactLottieConfig = {
    loop: true,
    renderer: 'canvas',
    autoplay: false,
    animationData: animationData
  };
  const hoverableContainerStyle: CSS.Properties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  };

  return (
    <>
      <h1>Mouse events example</h1>
      <div
        style={hoverableContainerStyle}
        onMouseEnter={handleLottieMouseEnter}
        onMouseLeave={handleLottieMouseLeave}
      >
        <Lottie
          playingState={'playing'}
          speed={speed}
          direction={direction}
          width='350px'
          className={cs('lottie-container', 'hoverable')}
          height='350px'
          config={reactLottieConfig} />
        <p>
          <b>mouseenter</b>: slowdown
          <br/>
          <b>mouseleave</b>: reverse & reset speed
          </p>
      </div>
    </>
  )
}