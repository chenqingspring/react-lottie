import React, { useState } from 'react';
import { Lottie, ReactLottieConfig } from './reactComponentLib';

export const LottieRemote = () => {
  const lottie1 = 'https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/gatin/data.json';
  const lottie2 = 'https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/navidad/data.json';
  const [currentLottiePath, setLottiePath] = useState(lottie1);
  const toggleAnimation = () => {
    setLottiePath(currentLottiePath === lottie1 ? lottie2 : lottie1);
  };
  const config: ReactLottieConfig = { path: currentLottiePath, loop: true, autoplay: true };
  return (
    <>
      <h1>Remotely loaded JSON:</h1>
      <Lottie width="350px" height="350px" className="lottie-container" config={config} />
      <p>
        Remotely loaded animation from{' '}
        <a target="_blank" rel="noopener noreferrer" href={currentLottiePath}>
          here
        </a>
      </p>
      <button onClick={toggleAnimation}>Toggle</button>
    </>
  );
};
