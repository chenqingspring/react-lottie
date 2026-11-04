import React from 'react';
import LottieControl from './lottie-control';
import LottieControlSegments from './lottie-control-segments';
import ToggleLike from './toggle-like';
import TransitionLoop from './TransitionLoop';
import TransitionWithOptions from './TransitionWithOptions';

export default {
  title: 'Lottie Animation View',
};

export const WithControl = () => <LottieControl />;
export const ToggleLikeStory = () => <ToggleLike />;
export const TransitionsAndLoops = () => <TransitionLoop />;
export const TransitionsWithOptions = () => <TransitionWithOptions />;
export const WithSegments = () => <LottieControlSegments />;
