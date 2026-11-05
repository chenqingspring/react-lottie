import React from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';
import { applyColorFilters, colorFiltersAreEqual } from './colorFilters';

const segmentsAreEqual = (a, b) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
};

export default class Lottie extends React.Component {
  componentDidMount() {
    const {
      options,
      eventListeners,
      colorFilters,
    } = this.props;

    const {
      loop,
      autoplay,
      animationData,
      renderer = 'svg',
      rendererSettings,
      segments,
    } = options;

    /* Keep the caller's data and filter list around so a later update can tell
       whether either actually changed. */
    this.animationData = animationData;
    this.colorFilters = colorFilters;
    const filteredAnimationData = applyColorFilters(animationData, colorFilters);

    this.options = {
      container: this.el,
      renderer,
      loop: loop !== false,
      autoplay: autoplay !== false,
      segments: segments !== false,
      animationData: filteredAnimationData,
      rendererSettings,
    };

    this.options = { ...this.options, ...options };
    /* Spreading `options` restored the unfiltered data; use the filtered copy
       after the merge. */
    this.options.animationData = filteredAnimationData;

    if (
      typeof process !== 'undefined'
      && process.env.NODE_ENV !== 'production'
      && Array.isArray(colorFilters)
      && colorFilters.length > 0
      && !animationData
    ) {
      console.warn(
        '[react-lottie] colorFilters requires options.animationData; '
        + 'animations loaded from options.path are not recolored.'
      );
    }

    this.anim = lottie.loadAnimation(this.options);
    this.registerEvents(eventListeners);
    this.setSpeed();
    this.setDirection();
    this.setSubframe();

    /* Apply a segment passed on mount. The component otherwise only reacts to
       `segments` changes, so the animation used to play the whole timeline
       until the prop was updated. */
    if (this.props.segments && this.props.segments.length === 2) {
      const wasPaused = this.anim.isPaused;
      this.playSegments();
      if (wasPaused) {
        this.pause();
      }
    }

    /* Apply the initial playback props, which are otherwise only read on update */
    if (this.props.isStopped) {
      this.stop();
    } else if (this.props.isPaused) {
      this.pause();
    }
  }

  componentDidUpdate(prevProps) {
    /* Recreate the animation handle if the data, its remote path or the color
       filters changed. Done here rather than in componentWillUpdate, which
       React has deprecated and which is unsafe in concurrent rendering
       (#77, #100, #119). */
    const dataChanged = this.animationData !== this.props.options.animationData;
    const pathChanged = this.options.path !== this.props.options.path;
    const colorFiltersChanged = !colorFiltersAreEqual(
      this.colorFilters,
      this.props.colorFilters,
    );

    if (dataChanged || pathChanged || colorFiltersChanged) {
      const currentFrame = this.anim ? this.anim.currentFrame : 0;
      const wasPaused = this.anim ? this.anim.isPaused : true;
      /* lottie-web cannot recolor a loaded animation, so a filter change has to
         load the data again. Only a filter-only change restores the frame. */
      const colorOnlyChange = colorFiltersChanged && !dataChanged && !pathChanged;

      this.deRegisterEvents(prevProps.eventListeners);
      this.destroy();

      this.animationData = this.props.options.animationData;
      this.colorFilters = this.props.colorFilters;
      this.options = { ...this.options, ...this.props.options };
      this.options.animationData = applyColorFilters(
        this.props.options.animationData,
        this.props.colorFilters,
      );
      this.anim = lottie.loadAnimation(this.options);
      this.registerEvents(this.props.eventListeners);

      /* Keep the frame and playback state so a theme change does not restart
         a paused or half-played animation. */
      if (colorOnlyChange) {
        if (this.props.segments) this.anim.playSegments(this.props.segments, true);
        if (Number.isFinite(currentFrame)) this.anim.goToAndStop(currentFrame, true);
        if (!wasPaused) this.anim.play();
      }
    }

    /* Only drive playback when a playback prop asks for it. Re-rendering used
       to call play() unconditionally, which started an animation that was
       created with `autoplay: false` and restarted one the caller had paused
       (#32, #43, #58). A newly loaded animation is left to its own `autoplay`
       setting unless one of the playback props overrides it below. */
    const playbackChanged = prevProps.isStopped !== this.props.isStopped
      || prevProps.isPaused !== this.props.isPaused
      || !segmentsAreEqual(prevProps.segments, this.props.segments);

    if (this.props.isStopped) {
      this.stop();
    } else if (this.props.isPaused) {
      this.pause();
    } else if (playbackChanged) {
      if (this.props.segments) {
        this.playSegments();
      } else {
        this.play();
      }
    }

    this.setSpeed();
    this.setDirection();
    this.setSubframe();
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

  /* `isSubframe` mirrors lottie-web's setSubframe(): with it enabled (the
     default) frames are interpolated, with it disabled `enterFrame` fires only
     on whole After Effects frames (issue #71). */
  setSubframe() {
    this.anim.setSubframe(this.props.isSubframe);
  }

  play() {
    this.anim.play();
  }

  /* Frame/marker control from a ref, e.g. to sync an animation to scroll.
     `isFrame` false treats the value as a time in seconds (issue #40). */
  goToAndStop(value, isFrame) {
    this.anim.goToAndStop(value, isFrame);
  }

  goToAndPlay(value, isFrame) {
    this.anim.goToAndPlay(value, isFrame);
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
      // Click-to-pause is intentional and role="button" is set; keyboard control
      // is not part of the API yet.
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
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
  colorFilters: PropTypes.arrayOf(PropTypes.shape({
    keypath: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  segments: PropTypes.arrayOf(PropTypes.number),
  direction: PropTypes.number,
  isSubframe: PropTypes.bool,
  ariaRole: PropTypes.string,
  ariaLabel: PropTypes.string,
  isClickToPauseDisabled: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
};

Lottie.defaultProps = {
  eventListeners: [],
  colorFilters: [],
  isStopped: false,
  isPaused: false,
  speed: 1,
  isSubframe: true,
  ariaRole: 'button',
  ariaLabel: 'animation',
  isClickToPauseDisabled: false,
  title: '',
  tabIndex: 0,
};
