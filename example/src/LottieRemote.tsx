import React from 'react';
import { Lottie } from './reactComponentLib';

export const LottieRemote = () => {
  const remoteLottiePath = 'https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/gatin/data.json';
  return (
    <>
      <h1>Basic lottie:</h1>
      <Lottie width="350px" height="350px" className="lottie-container" config={{ path: remoteLottiePath, loop: true, autoplay: true }} />
      <p>Remotely loaded animation from <a target="_blank" rel="noopener noreferrer" href={remoteLottiePath}>here</a></p>
    </>
  );
};
