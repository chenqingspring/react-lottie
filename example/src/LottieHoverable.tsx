import React, { useState } from 'react';
import spinnerLottieData from './lotties/spinner-animation.json';
import CSS from 'csstype';
import cs from 'classnames';

import { Lottie, ReactLottieConfig } from './reactComponentLib';
import { AnimationDirection } from 'lottie-web';

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
    animationData: spinnerLottieData
  };
  const hoverableContainerStyle: CSS.Properties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px auto',
    textAlign: 'center',
  };

  const lottieStyles: CSS.Properties = {
    borderRadius: '10px',
    boxShadow: '0 0 14px 1px #444'
  }

  return (
    <div style={hoverableContainerStyle}>
      <h1>Hover to slowdown and reverse the animation:</h1>
      <div
        onMouseEnter={handleLottieMouseEnter}
        onMouseLeave={handleLottieMouseLeave}
      >
        <Lottie
          playingState={'playing'}
          speed={speed}
          direction={direction}
          width='200px'
          className={cs('lottie-container', 'hoverable')}
          height='200px'
          style={lottieStyles}
          config={reactLottieConfig} />
        <p>renderer: <b>{reactLottieConfig.renderer.toUpperCase()}</b></p>
      </div>
    </div>
  )
}