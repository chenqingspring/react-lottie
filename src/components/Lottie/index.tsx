import React from 'react';
import lottiePlayer, { AnimationConfigWithData, AnimationItem } from 'lottie-web';
import { ReactLottieOwnProps, ReactLottieEvent, ReactLottieConfig, ReactLottiePlayingState } from './interface'

export class Lottie extends React.Component<ReactLottieOwnProps> {
  config: ReactLottieConfig;
  el: Element;
  animationItem: AnimationItem;
  defaultLottieConfig: ReactLottieConfig = {
    renderer: 'svg',
    loop: false,
    autoplay: true
  }

  public static defaultProps: ReactLottieOwnProps = {
    eventListeners: [],
    playingState: 'playing',
    speed: 1,
    height: '100%',
    width: '100%',
  };

  componentDidMount() {
    const { config: configFromProps, eventListeners, } = this.props;
    this.config = {
      ...this.defaultLottieConfig,
      ...configFromProps,
      container: this.el,
    };
    this.animationItem = lottiePlayer.loadAnimation(this.config as AnimationConfigWithData);
    this.addEventListeners(eventListeners);
  }

  UNSAFE_componentWillUpdate(nextProps: ReactLottieOwnProps) {//TODO: to be refactored
    if (this.config.animationData !== nextProps.config.animationData) {
      this.removeEventListeners(this.props.eventListeners);
      this.animationItem.destroy();
      this.config = { ...this.config, ...nextProps.config };
      this.animationItem = lottiePlayer.loadAnimation(this.config as AnimationConfigWithData);
      this.addEventListeners(nextProps.eventListeners);
    }
  }

  componentDidUpdate() {
    const {
      playingState,
      speed,
      direction,
    } = this.props;
    this.setAnimationPlayingState(playingState);
    this.animationItem.setSpeed(speed);
    this.animationItem.setDirection(direction);
  }

  componentWillUnmount() {
    this.removeEventListeners(this.props.eventListeners);
    this.animationItem.destroy();
    this.config.animationData = null;
    this.animationItem = null;
  }

  setAnimationPlayingState = (state: ReactLottiePlayingState) => {
    switch (state) {
      case 'playing': {
        this.triggerPlayBasedOnSegments();
        return;
      }
      case 'stopped': {
        this.animationItem.stop();
        return;
      }
      case 'paused': {
        this.animationItem.pause();
        return;
      }
      default: {
        throw new Error('Playing state not specified.');
      }
    }
  }

  triggerPlayBasedOnSegments() {
    const { segments } = this.props;
    if (segments) {
      this.animationItem.playSegments(segments);
    } else {
      this.animationItem.play();
    }
  }

  addEventListeners(reactLottieEvents: ReactLottieEvent[]) {
    reactLottieEvents.forEach(({ name, callback }) => {
      this.animationItem.addEventListener(name, callback);
    });
  }

  removeEventListeners(reactLottieEvents: ReactLottieEvent[]) {
    reactLottieEvents.forEach(({ name, callback }) => {
      this.animationItem.removeEventListener(name, callback);
    });
  }

  render() {
    const {
      width,
      height,
      style
    } = this.props;

    const lottieStyles = {
      width: width,
      height: height,
      ...style,
    };

    return (
      <div
        ref={(c) => {
          this.el = c;
        }}
        style={lottieStyles}
      />
    );
  }
}