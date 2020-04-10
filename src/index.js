import React, { Component } from "react";
import PropTypes from "prop-types";
import { loadAnimation } from "lottie-web";

import { getSize } from "./utils";

export default class Lottie extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    eventListeners: PropTypes.arrayOf(PropTypes.object),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    renderAs: PropTypes.oneOf(["div", "span"]),
    isStopped: PropTypes.bool,
    isPaused: PropTypes.bool,
    speed: PropTypes.number,
    segments: PropTypes.arrayOf(PropTypes.number),
    direction: PropTypes.number,
    role: PropTypes.string,
    ariaLabel: PropTypes.string,
    isClickToPauseDisabled: PropTypes.bool,
    title: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    tabIndex: PropTypes.number
  };

  static defaultProps = {
    renderAs: "div",
    eventListeners: [],
    isStopped: false,
    isPaused: false,
    speed: 1,
    role: null,
    ariaLabel: "animation",
    isClickToPauseDisabled: false,
    title: null,
    className: null,
    tabIndex: 0
  };
  
  componentDidMount() {
    const { options, eventListeners } = this.props;
    const {
      loop,
      autoplay,
      animationData,
      rendererSettings,
      segments,
    } = options;

    this.options = {
      container: this.el,
      renderer: "svg",
      loop: loop !== false,
      autoplay: autoplay !== false,
      segments: segments !== false,
      animationData,
      rendererSettings,
      ...options
    };
    this.anim = loadAnimation(this.options);
    this.registerEvents(eventListeners);
  }

  componentDidUpdate(nextProps) {
    /* Recreate the animation handle if the data is changed */
    const { eventListeners, isStopped, segments } = this.props;
    if (this.options.animationData !== nextProps.options.animationData) {
      this.deRegisterEvents(eventListeners);
      this.destroy();
      this.options = { ...this.options, ...nextProps.options };
      this.anim = loadAnimation(this.options);
      this.registerEvents(nextProps.eventListeners);
    }

    if (isStopped) {
      this.stop();
    } else if (segments) {
      this.playSegments();
    } else {
      this.play();
    }

    this.pause();
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
    this.anim.playSegments(this.props.segments);
  }

  stop() {
    this.anim.stop();
  }

  pause() {
    if (this.props.isPaused && !this.anim.isPaused) {
      this.anim.pause();
    } else if (!this.props.isPaused && this.anim.isPaused) {
      this.anim.pause();
    }
  }

  destroy() {
    this.anim.destroy();
  }

  registerEvents(eventListeners) {
    eventListeners.forEach(({ eventName, callback }) => {
      this.anim.addEventListener(eventName, callback);
    });
  }

  deRegisterEvents(eventListeners) {
    eventListeners.forEach(({ eventName, callback }) => {
      this.anim.removeEventListener(eventName, callback);
    });
  }

  handleClickToPause = () => {
    // The pause() method is for handling pausing by passing a prop isPaused
    // This method is for handling the ability to pause by clicking on the animation
    if (this.anim.isPaused) {
      return this.anim.play();
    }
    this.anim.pause();
  }

  render() {
    const {
      renderAs,
      width,
      height,
      ariaLabel,
      isClickToPauseDisabled,
      style,
      ...extraProps
    } = this.props;
    
    const lottieStyles = {
      width: getSize(width),
      height: getSize(height),
      outline: "none",
      ...style,
    };
    const onClickHandler =
      isClickToPauseDisabled
        ? () => null
        : this.handleClickToPause;
    const Element = renderAs;
    return (
      <Element
        ref={(c) => {
          this.el = c;
        }}
        style={lottieStyles}
        onClick={onClickHandler}
        aria-label={ariaLabel}
        {...extraProps}
      />
    );
  }
}
