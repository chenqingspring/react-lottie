import React from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';
import { applyColorFilters, colorFiltersAreEqual } from './colorFilters';

const segmentsAreEqual = (a, b) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
};

/* lottie-web crashes deep inside its renderer with "Cannot read property
   'length' of undefined" when the data is not a plain animation object. Accept
   the shapes users actually pass (a namespace import, a frozen ESM object) and
   fail with an actionable message for the rest (#24, #44, #65). */
const normalizeAnimationData = (animationData, path) => {
  if (animationData === undefined || animationData === null) {
    if (!path) {
      throw new Error(
        '[react-lottie] options must include `animationData` (the imported JSON) '
        + 'or `path` (a URL to the JSON file).'
      );
    }
    return animationData;
  }

  if (typeof animationData === 'string') {
    throw new Error(
      '[react-lottie] options.animationData must be an object, not a string. '
      + 'Pass a file path or URL as options.path instead, or call JSON.parse() '
      + 'on JSON text first.'
    );
  }

  /* `import * as animationData` wraps the payload in a `default` property,
     which lottie-web cannot read (#24, #65). */
  if (!Array.isArray(animationData.layers) && animationData.default) {
    return normalizeAnimationData(animationData.default, path);
  }

  /* lottie-web annotates the loaded animation (`__complete`), which throws on
     the frozen objects produced by strict ESM bundlers (#24). */
  if (Object.isFrozen(animationData)) {
    return JSON.parse(JSON.stringify(animationData));
  }

  return animationData;
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
    this.locationHref = options.locationHref;
    const filteredAnimationData = applyColorFilters(
      normalizeAnimationData(animationData, options.path),
      colorFilters,
    );

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

    /* Must happen before the animation is generated: lottie-web bakes the base
       URL into its mask, matte, gradient and filter references (issue #111). */
    this.setLocationHref(options);

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
    /* lottie-web bakes the base URL into each generated `url(#id)` reference,
       so a new href only takes effect when the animation is generated again. */
    const locationHrefChanged = this.locationHref !== this.props.options.locationHref;
    /* The wrapper element is part of lottie-web's configuration, so a new
       element means the animation has to be bound to the new node. */
    const containerChanged = prevProps.as !== this.props.as;

    if (dataChanged || pathChanged || colorFiltersChanged || locationHrefChanged || containerChanged) {
      const currentFrame = this.anim ? this.anim.currentFrame : 0;
      const wasPaused = this.anim ? this.anim.isPaused : true;
      /* lottie-web cannot recolor a loaded animation and cannot move one to
         another node, so those changes load the same data again. Only then is
         it worth restoring the frame and playback state. */
      const reloadInPlace = !dataChanged && !pathChanged;

      this.deRegisterEvents(prevProps.eventListeners);
      this.destroy();

      this.animationData = this.props.options.animationData;
      this.colorFilters = this.props.colorFilters;
      this.locationHref = this.props.options.locationHref;
      this.options = { ...this.options, ...this.props.options };
      /* `options` is caller-owned and knows nothing about the wrapper, so the
         ref (already pointing at the newly rendered node) wins. */
      this.options.container = this.el;
      this.options.animationData = applyColorFilters(
        normalizeAnimationData(
          this.props.options.animationData,
          this.props.options.path,
        ),
        this.props.colorFilters,
      );
      this.setLocationHref(this.options);
      this.anim = lottie.loadAnimation(this.options);
      this.registerEvents(this.props.eventListeners);

      /* Keep the frame and playback state so a theme or element change does
         not restart a paused or half-played animation. */
      if (reloadInPlace) {
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
    /* A failed loadAnimation (e.g. invalid animationData) leaves no options. */
    if (this.options) this.options.animationData = null;
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

  /* lottie-web writes its internal mask, matte, gradient and filter references
     as `url(<locationHref>#id)`. Safari resolves them against the page's base
     URL, so a `<base href>` (or a mismatched asset URL) makes it drop the
     masks; other browsers are more forgiving. lottie-web's documented fix is
     the global `setLocationHref()`, which has to run before the animation is
     generated (issue #111). Passing `options.locationHref` lets callers do
     that without importing lottie-web themselves, which also works when the
     bundler gives them a different copy of the player. */
  setLocationHref(options) {
    if (options.locationHref != null) {
      lottie.setLocationHref(options.locationHref);
    }
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
    /* `eventListeners` is array-valued and defaults to `[]`, but a wrapper
       component (React.lazy, an HOC, a prop spread with `null`) can hand us
       something else. Treat anything that is not an array as "no listeners";
       blindly calling forEach used to crash on mount and unmount (#137). */
    if (!this.anim || !Array.isArray(eventListeners)) return;
    eventListeners.forEach((eventListener) => {
      this.anim.addEventListener(eventListener.eventName, eventListener.callback);
    });
  }

  deRegisterEvents(eventListeners) {
    if (!this.anim || !Array.isArray(eventListeners)) return;
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
      as: Container,
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
      <Container
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
  as: PropTypes.elementType,
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
  as: 'div',
};
