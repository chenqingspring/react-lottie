import React from 'react';
import lottiePlayer, { AnimationConfigWithData, AnimationItem } from 'lottie-web';
import { ReactLottieOwnProps, ReactLottieEvent, ReactLottieConfig, ReactLottiePlayingState } from './interface'

export class Lottie extends React.PureComponent<ReactLottieOwnProps> {
  private config: ReactLottieConfig;
  private containerRef: Element;
  private animationItem: AnimationItem;
  private defaultLottieConfig: ReactLottieConfig = {
    renderer: 'svg',
    loop: false,
    autoplay: true
  }

  public static defaultProps: ReactLottieOwnProps = {
    lottieEventListeners: [],
    playingState: 'playing',
    speed: 1,
    height: '100%',
    width: '100%',
  };

  componentDidMount() {
    const { config: configFromProps, lottieEventListeners } = this.props;
    this.config = {
      ...this.defaultLottieConfig,
      ...configFromProps,
      container: this.containerRef,
    };
    this.animationItem = lottiePlayer.loadAnimation(this.config as AnimationConfigWithData);
    this.addEventListeners(lottieEventListeners);
    this.configureAnimationItem();
  }

  UNSAFE_componentWillUpdate(nextProps: ReactLottieOwnProps) {//TODO: to be refactored
    if (this.config.animationData !== nextProps.config.animationData) {
      this.removeEventListeners(this.props.lottieEventListeners);
      this.animationItem.destroy();
      this.config = { ...this.config, ...nextProps.config };
      this.animationItem = lottiePlayer.loadAnimation(this.config as AnimationConfigWithData);
      this.addEventListeners(nextProps.lottieEventListeners);
    }
  }

  componentDidUpdate() {
    this.configureAnimationItem();
  }

  componentWillUnmount() {
    this.removeEventListeners(this.props.lottieEventListeners);
    this.animationItem.destroy();
    this.config.animationData = null;
    this.animationItem = null;
  }

  private configureAnimationItem() {
    const {
      playingState,
      speed,
      direction,
    } = this.props;
    this.setAnimationPlayingState(playingState);
    this.animationItem.setSpeed(speed);
    this.animationItem.setDirection(direction);
  }

  private setAnimationPlayingState = (state: ReactLottiePlayingState) => {
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

  private triggerPlayBasedOnSegments() {
    const { segments } = this.props;
    if (segments) {
      this.animationItem.playSegments(segments);
    } else {
      this.animationItem.play();
    }
  }

  private addEventListeners(reactLottieEvents: ReactLottieEvent[]) {
    reactLottieEvents.forEach(({ name, callback }) => {
      this.animationItem.addEventListener(name, callback);
    });
  }

  private removeEventListeners(reactLottieEvents: ReactLottieEvent[]) {
    reactLottieEvents.forEach(({ name, callback }) => {
      this.animationItem.removeEventListener(name, callback);
    });
  }

  private setContainerRef = (element: HTMLElement) => {
    this.containerRef = element;
  }

  render() {
    const {
      width,
      height,
      style,
      className,
    } = this.props;

    const lottieStyle = {
      width: width,
      height: height,
      ...style,
    };

    return (
      <div
        className={className}
        ref={this.setContainerRef}
        style={lottieStyle}
      />
    );
  }
}