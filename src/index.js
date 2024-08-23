import React from 'react';
import PropTypes from 'prop-types';
import lottiePlayer from 'lottie-web';

export default class Lottie extends React.Component {
  componentDidMount() {
    const {
      options,
      eventListeners,
    } = this.props;

    const {
      loop,
      autoplay,
      animationData,
      rendererSettings,
      segments,
    } = options;

    if (!animationData) {
      console.error('animationData is missing');
      return;
    }

    this.options = {
      container: this.el,
      renderer: 'svg',
      loop: loop !== false,
      autoplay: autoplay !== false,
      segments: segments !== false,
      animationData,
      rendererSettings,
    };

    this.options = { ...this.options, ...options };

    try {
      this.anim = lottiePlayer.loadAnimation(this.options);
      if (!this.anim) {
        throw new Error('Animation failed to load');
      }
    } catch (error) {
      console.error('Failed to initialize animation:', error);
    }

    this.registerEvents(eventListeners);
  }

  componentWillUpdate(nextProps) {
    if (this.options.animationData !== nextProps.options.animationData) {
      this.deRegisterEvents(this.props.eventListeners);
      if (this.anim) {
        this.anim.destroy();
      }
      this.options = { ...this.options, ...nextProps.options };
      this.anim = lottiePlayer.loadAnimation(this.options);
      this.registerEvents(nextProps.eventListeners);
    }
  }

  componentWillUnmount() {
    this.deRegisterEvents(this.props.eventListeners);
    if (this.anim) {
      this.anim.destroy();
    }
    this.options.animationData = null;
    this.anim = null;
  }

  setSpeed() {
    if (this.anim) {
      this.anim.setSpeed(this.props.speed);
    }
  }

  setDirection() {
    if (this.anim) {
      this.anim.setDirection(this.props.direction);
    }
  }

  play() {
    if (this.anim) {
      this.anim.play();
    }
  }

  playSegments() {
    if (this.anim && this.props.segments) {
      this.anim.playSegments(this.props.segments);
    }
  }

  stop() {
    if (this.anim) {
      this.anim.stop();
    }
  }

  pause() {
    if (this.anim) {
      if (this.props.isPaused && !this.anim.isPaused) {
        this.anim.pause();
      } else if (!this.props.isPaused && this.anim.isPaused) {
        this.anim.pause();
      }
    }
  }

  destroy() {
    if (this.anim) {
      this.anim.destroy();
    }
  }

  registerEvents(eventListeners) {
    if (this.anim) {
      eventListeners.forEach((eventListener) => {
        this.anim.addEventListener(eventListener.eventName, eventListener.callback);
      });
    }
  }

  deRegisterEvents(eventListeners) {
    if (this.anim) {
      eventListeners.forEach((eventListener) => {
        this.anim.removeEventListener(eventListener.eventName, eventListener.callback);
      });
    }
  }

  handleClickToPause = () => {
    if (this.anim) {
      if (this.anim.isPaused) {
        this.anim.play();
      } else {
        this.anim.pause();
      }
    }
  }

  render() {
    const {
      width,
      height,
      ariaRole,
      ariaLabel,
      isClickToPauseDisabled,
      title,
    } = this.props;

    const getSize = (initial) => {
      let size;

      if (typeof initial === 'number') {
        size = `${initial}px`;
      } else {
        size = initial || '100%';
      }

      return size;
    };

    const lottieStyles = {
      width: getSize(width),
      height: getSize(height),
      overflow: 'hidden',
      margin: '0 auto',
      outline: 'none',
      ...this.props.style,
    };

    const onClickHandler = isClickToPauseDisabled ? () => null : this.handleClickToPause;

    return (
      <div
        ref={(c) => {
          this.el = c;
        }}
        style={lottieStyles}
        onClick={onClickHandler}
        title={title}
        role={ariaRole}
        aria-label={ariaLabel}
        tabIndex="0"
      />
    );
  }
}

Lottie.propTypes = {
  eventListeners: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  segments: PropTypes.arrayOf(PropTypes.number),
  direction: PropTypes.number,
  ariaRole: PropTypes.string,
  ariaLabel: PropTypes.string,
  isClickToPauseDisabled: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.string,
};

Lottie.defaultProps = {
  eventListeners: [],
  isStopped: false,
  isPaused: false,
  speed: 1,
  ariaRole: 'button',
  ariaLabel: 'animation',
  isClickToPauseDisabled: false,
  title: '',
};