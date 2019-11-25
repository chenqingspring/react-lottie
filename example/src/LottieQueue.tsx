import React, { Component } from 'react';
import CSS from 'csstype';
import spinnerLottieData from './lotties/spinner-animation.json';
import vanLottieData from './lotties/11562-van-icon.json';
import lightBulbLottieData from './lotties/3520-light-bulb.json';
import loadingLottieData from './lotties/142-loading-animation.json';

import { Lottie, ReactLottieOwnProps } from './reactComponentLib';

export class LottieQueue extends Component<any, ReactLottieOwnProps> {
  private animationsQueue = [
    spinnerLottieData,
    vanLottieData,
    loadingLottieData,
    vanLottieData,
    lightBulbLottieData,
  ];

  constructor(props: any) {
    super(props);
    this.state = {
      playingState: 'playing',
      speed: 1,
      direction: 1,
    };
  }

  componentDidMount() {
    this.nextAnimation();
  }

  restart = () => {
    this.setState({ playingState: 'stopped' });
    this.setState({ playingState: 'playing' });
  }

  setPlaying = () => {
    this.setState({ playingState: 'playing' })
  }
  setPaused = () => {
    this.setState({ playingState: 'paused' })
  }
  setStopped = () => {
    this.setState({ playingState: 'stopped' })
  }

  nextAnimation = () => {
    const next = this.animationsQueue.shift();
    if (!next) {
      this.setState({
        playingState: 'paused'
      });
      return;
    }
    this.setState({
      config: { animationData: next }
    });
  }

  render() {
    const centerStyle = {
      display: 'block',
      margin: '10px auto',
      textAlign: 'center' as const,
    };
    const lottieStyles: CSS.Properties = {
      borderRadius: '10px',
      margin: '40px auto 0',
      boxShadow: '0 0 14px 1px #444',
    }
    const { playingState, direction, config, speed, segments } = this.state;
    return (
      <div
        style={centerStyle}
      >
        <h1>Animations queue:</h1>
        <Lottie
          config={config}
          height="350px"
          width='350px'
          style={lottieStyles}
          playingState={playingState}
          speed={speed}
          segments={segments}
          direction={direction}
          eventListeners={[
            { callback: () => console.log('\'DOMLoaded\' event callback triggered '), name: 'DOMLoaded' },
            { callback: () => { console.log('\'complete\' event callback triggered '); this.nextAnimation() }, name: 'complete' },
          ]}
        />

        <p style={centerStyle}>Controls:</p>
        <div style={centerStyle}>
          <input type="button" value="Start" onClick={this.setPlaying} />
          <input type="button" value="Pause" onClick={this.setPaused} />
          <input type="button" value="Stop" onClick={this.setStopped} />
          <input type="button" value="Next" onClick={this.nextAnimation} />
        </div>
        <p style={centerStyle}>Speed: x{speed}</p>
        <input
          style={centerStyle}
          type="range" value={speed} min="0" max="10" step="0.5"
          onChange={e => this.setState({ speed: parseFloat(e.currentTarget.value) || 1 })}
        />
        {segments && <p style={centerStyle}>Segment range: {JSON.stringify(segments)}</p>}
      </div>
    );
  }
}

