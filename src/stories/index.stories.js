import React from 'react';
import LottieControl from './lottie-control';
import LottieControlSegments from './lottie-control-segments';
import LottieColorFilters from './lottie-color-filters';
import LottieAccessible from './lottie-accessible';
import LottieRendererSettings from './lottie-renderer-settings';
import LottieRenderer from './lottie-renderer';
import LottieLoop from './lottie-loop';
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
export const WithColorFilters = () => <LottieColorFilters />;
export const AccessibleInline = () => <LottieAccessible />;
export const WithRendererSettings = () => <LottieRendererSettings />;
export const WithRendererToggle = () => <LottieRenderer />;
export const WithLoopToggle = () => <LottieLoop />;
