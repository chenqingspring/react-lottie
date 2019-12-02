import {
  AnimationEventCallback,
  AnimationEventName,
  AnimationConfigWithPath,
  AnimationConfigWithData,
  AnimationDirection,
  AnimationSegment,
} from 'lottie-web';
import CSS from 'csstype';

export interface ReactLottieEvent<T = any> {
  name: AnimationEventName;
  callback: AnimationEventCallback<T>;
}

export type ReactLottieConfig = Partial<AnimationConfigWithData> & { animationData: any }  | Partial<AnimationConfigWithPath> & { path: string };

export interface ReactLottieOwnProps {
  config?: ReactLottieConfig;
  lottieEventListeners?: ReactLottieEvent[];
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
