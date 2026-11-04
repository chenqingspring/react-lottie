import React from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';

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
      renderer = 'svg',
      rendererSettings,
      segments,
    } = options;

    this.options = {
      container: this.el,
      renderer,
      loop: loop !== false,
      autoplay: autoplay !== false,
      segments: segments !== false,
      animationData,
      rendererSettings,
    };

    this.options = { ...this.options, ...options };
    this.anim = lottie.loadAnimation(this.options);
    this.registerEvents(eventListeners);
    this.setSpeed();
    this.setDirection();

    /* Apply the initial playback props, which are otherwise only read on update */
    if (this.props.isStopped) {
      this.stop();
    } else if (this.props.isPaused) {
      this.pause();
    }
  }

  componentDidUpdate(prevProps) {
    /* Recreate the animation handle if the data or its remote path changed.
       Done here rather than in componentWillUpdate, which React has deprecated
       and which is unsafe in concurrent rendering (#77, #100, #119). */
    const dataChanged = this.options.animationData !== this.props.options.animationData;
    const pathChanged = this.options.path !== this.props.options.path;

    if (dataChanged || pathChanged) {
      this.deRegisterEvents(prevProps.eventListeners);
      this.destroy();
      this.options = { ...this.options, ...this.props.options };
      this.anim = lottie.loadAnimation(this.options);
      this.registerEvents(this.props.eventListeners);
    }

    /* Reconcile playback with the props without flashing to "playing" first:
       calling play() and then pause() on every update restarts an animation
       that the caller paused (#58). */
    if (this.props.isStopped) {
      this.stop();
    } else if (this.props.isPaused) {
      this.pause();
    } else if (this.props.segments) {
      this.playSegments();
    } else {
      this.play();
    }

    this.setSpeed();
    this.setDirection();
  }

  componentWillUnmount() {
    this.deRegisterEvents(this.props.eventListeners);
    this.destroy();
    this.options.animationData = null;
    this.anim = null;
  }

  setSpeed() {
    this.anim.setSpeed(this.props.speed);
  }

  setDirection() {
    this.anim.setDirection(this.props.direction);
  }

  play() {
    this.anim.play();
  }

  playSegments() {
    /* Passing `force` replays the new segments even if the animation is
       already running, so a segments prop change takes effect immediately. */
    this.anim.playSegments(this.props.segments, true);
  }

  stop() {
    this.anim.stop();
  }

  pause() {
    this.anim.pause();
  }

  destroy() {
    /* The animation may already be gone, e.g. after a fast unmount or a
       failed loadAnimation call (issue #51). */
    if (!this.anim) return;
    this.anim.destroy();
  }

  registerEvents(eventListeners) {
    eventListeners.forEach((eventListener) => {
      this.anim.addEventListener(eventListener.eventName, eventListener.callback);
    });
  }

  deRegisterEvents(eventListeners) {
    eventListeners.forEach((eventListener) => {
      this.anim.removeEventListener(eventListener.eventName, eventListener.callback);
    });
  }

  handleClickToPause = () => {
    // The pause() method is for handling pausing by passing a prop isPaused
    // This method is for handling the ability to pause by clicking on the animation
    if (this.anim.isPaused) {
      this.anim.play();
    } else {
      this.anim.pause();
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
      tabIndex,
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
      // Bug with eslint rules https://github.com/airbnb/javascript/issues/1374
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        ref={(c) => {
          this.el = c;
        }}
        style={lottieStyles}
        onClick={onClickHandler}
        title={title}
        role={ariaRole}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
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
  style: PropTypes.object,
  tabIndex: PropTypes.number,
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
  tabIndex: 0,
};
