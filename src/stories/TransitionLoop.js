import React from 'react';
import Lottie from '../index';
import * as animationDataA from './TwitterHeart.json';
import * as animationDataB from './beating-heart.json';

/**
 * TransitionLoop, demonstrates the use of the eventListener Props.
 * NOTE: there appears to currently be a bug in either
 * react-lottie or lottie-web which results in a chance of the loop option not
 * taking effect accross different animations.
 */
export default class TransitionLoop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isStopped: true,
      isPaused: false,
      speed: 1,
      direction: 1,
      isLike: false,
      isTransitioned: false,
    };
  }

  transition() {
    this.setState({ isTransitioned: true });
  }

  clickHandler = () => {
    this.setState({ isTransitioned: false });
  };

  render() {
    const centerStyle = {
      display: 'block',
      margin: '10px auto',
      textAlign: 'center',
    };
    const { isTransitioned } = this.state;
    const defaultOptions = {
      animationData: !isTransitioned ? animationDataA : animationDataB,
      loop: true,
      autoplay: true,
    };

    return (
      <div>
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          eventListeners={
            !isTransitioned
              ? [
                {
                  eventName: 'loopComplete',
                  callback: () => this.transition(),
                },
              ]
              : []
          }
        />
        <button style={centerStyle} onClick={this.clickHandler}>
          restart
        </button>
      </div>
    );
  }
}
