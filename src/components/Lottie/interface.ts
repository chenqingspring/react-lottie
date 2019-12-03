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

export type ReactLottieConfigWithData = Partial<AnimationConfigWithData> & { animationData: any };

export type ReactLottieConfigWithPath = Partial<AnimationConfigWithPath> & { path: string };

export type ReactLottieConfig = ReactLottieConfigWithData | ReactLottieConfigWithPath;

export interface ReactLottieState {
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

export interface ReactLottieOwnProps extends ReactLottieState {
  config: ReactLottieConfig;
}

export type ReactLottiePlayingState = 'playing' | 'paused' | 'stopped';
