import {
  AnimationEventCallback,
  AnimationEventName,
  AnimationConfigWithData,
  AnimationDirection,
  AnimationSegment
} from 'lottie-web';
import CSS from 'csstype';

export interface ReactLottieEvent<T = any> {
  name: AnimationEventName;
  callback: AnimationEventCallback<T>
}

export type ReactLottieConfig = Partial<AnimationConfigWithData>;

export interface ReactLottieOwnProps {
  config?: ReactLottieConfig;
  eventListeners?: ReactLottieEvent[];
  height?: string;
  width?: string;
  playingState?: ReactLottiePlayingState;
  segments?: AnimationSegment | AnimationSegment[];
  speed?: number;
  style?: CSS.Properties;
  className?: string;
  direction?: AnimationDirection;
}

export type ReactLottiePlayingState = 'playing' | 'paused' | 'stopped';