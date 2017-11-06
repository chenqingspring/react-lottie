import React from 'react';
import PropTypes from 'prop-types';
import bodymovin from 'bodymovin';

export default class Lottie extends React.Component {
  render() {
    const { width, height } = this.props;
    const lottieStyles = {
      width: width ? `${width}px` : '100%',
      height: height ? `${height}px` : '100%',
      overflow: 'hidden',
      margin: '0 auto',
    };

    return <div ref="lavContainer" style={lottieStyles} />;
  }

  componentDidMount() {
    this.options = {
      container: this.refs.lavContainer,
      renderer: 'svg',
      loop: this.props.options.loop !== false,
      autoplay: this.props.options.autoplay !== false,
      animationData: this.props.options.animationData,
      rendererSettings: this.props.options.rendererSettings,
    };

    this.anim = bodymovin.loadAnimation(this.options);
    this.registerEvents(this.props.eventListeners);
  }

  componentWillUpdate(nextProps, nextState) {
    /* Recreate the animation handle if the data is changed */
    if (this.options.animationData !== nextProps.options.animationData) {
      this.deregisterEvents(this.props.eventListeners);
      this.destroy();
      this.options.animationData = nextProps.options.animationData;
      this.anim = bodymovin.loadAnimation(this.options);
      this.registerEvents(nextProps.eventListeners);
    }
  }

  componentDidUpdate() {
    this.props.isStopped ? this.stop() : this.play();
    this.pause();
    this.setSpeed();
    this.setDirection();
  }

  pause() {
    if (this.props.isPaused && !this.anim.isPaused) {
      this.anim.pause();
    } else if (!this.props.isPaused && this.anim.isPaused) {
      this.anim.pause();
    }
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  setSpeed() {
    this.anim.setSpeed(this.props.speed);
  }

  setDirection() {
    this.anim.setDirection(this.props.direction);
  }

  destroy() {
    this.anim.destroy();
  }

  registerEvents(eventListeners) {
    eventListeners.forEach((eventListener) => {
      this.anim.addEventListener(eventListener.eventName, eventListener.callback);
    });
  }

  deregisterEvents(eventListeners) {
    eventListeners.forEach((eventListener) => {
      this.anim.removeEventListener(eventListener.eventName, eventListener.callback);
    });
  }
}

Lottie.propTypes = {
  eventListeners: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  direction: PropTypes.number,
};

Lottie.defaultProps = {
  eventListeners: [],
  isStopped: false,
  isPaused: false,
  speed: 1,
};
