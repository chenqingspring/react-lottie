import { AnimationEventCallback, AnimationEventName, AnimationConfigWithData, AnimationDirection, AnimationSegment } from 'lottie-web';

export interface ReactLottieEvent<T = any> {
  name: AnimationEventName;
  callback: AnimationEventCallback<T>
}

export type ReactLottieConfig = Partial<AnimationConfigWithData> & {
  segments?: AnimationSegment | AnimationSegment[];
};

export interface ReactLottieOwnProps extends React.ComponentProps<'div'> {
  config?: ReactLottieConfig;
  eventListeners?: ReactLottieEvent[];
  height?: string;
  width?: string;
  playingState?: ReactLottiePlayingState;
  segments?: AnimationSegment | AnimationSegment[];
  speed?: number;
  direction?: AnimationDirection;
  ariaRole?: string | 'button';
  ariaLabel?: string | 'animation';
  isClickToPauseDisabled?: boolean;
  title?: string;
}

export type ReactLottiePlayingState = 'playing' | 'paused' | 'stopped';