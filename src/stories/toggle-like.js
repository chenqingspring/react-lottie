import React from 'react';
import Lottie from '../index';
import * as animationDataA from './TwitterHeart.json';

export default class ToggleLike extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isStopped: true,
      isPaused: false,
      speed: 1,
      direction: 1,
      isLike: false,
    };
  }

  render() {
    const centerStyle = {
      display: 'block',
      margin: '10px auto',
      textAlign: 'center',
    };
    const { isStopped, isPaused, direction, speed, isLike } = this.state;
    const defaultOptions = { animationData: animationDataA, loop: false, autoplay: false };

    const clickHandler = () => {
      if (!isStopped) {
        this.setState({ direction: direction * -1 });
      }
      this.setState({ isStopped: false, isLike: !isLike });
    };

    return (<div>
      <Lottie
        options={defaultOptions}
        height={400}
        width={400}
        isStopped={isStopped}
        isPaused={isPaused}
        speed={speed}
        direction={direction}
      />
      <button style={centerStyle} onClick={clickHandler}>{isLike ? 'unlike' : 'like'}</button>
    </div>);
  }
}
