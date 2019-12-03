import React from 'react';
import { Lottie, ReactLottieConfig } from './reactComponentLib';

export const LottieRemote = () => {
  const remoteLottiePath = 'https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/gatin/data.json';
  const config: ReactLottieConfig = { path: remoteLottiePath, loop: true, autoplay: true }
  return (
    <>
      <h1>Basic lottie:</h1>
      <Lottie width="350px" height="350px" className="lottie-container" config={config} />
      <p>Remotely loaded animation from <a target="_blank" rel="noopener noreferrer" href={remoteLottiePath}>here</a></p>
    </>
  );
};
