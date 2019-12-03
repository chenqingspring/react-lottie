import React, { Component } from 'react';
import CSS from 'csstype';

import { Lottie } from './reactComponentLib';
import loadingLottieData from './lotties/142-loading-animation.json';
import vanLottieData from './lotties/11562-van-icon.json';
import spinnerLottieData from './lotties/spinner-animation.json';
import lightBulbLottieData from './lotties/3520-light-bulb.json';
import { ReactLottieState } from './reactComponentLib/components/Lottie/interface';

export class LottieQueue extends Component<any, ReactLottieState> {
  private animationsQueue!: any[];
  private originalQueue = [
    spinnerLottieData,
    vanLottieData,
    loadingLottieData,
    vanLottieData,
    lightBulbLottieData,
  ];
  constructor(props: any) {
    super(props);
    this.animationsQueue = [...this.originalQueue];
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
      this.animationsQueue = [...this.originalQueue];
      this.nextAnimation();
      return;
    }
    this.setState({
      config: { animationData: next }
    });
  }

  getSpeedIcon = (speed) => {
    if (speed === 0) {
      return "🛌";
    } else if (speed < 1) {
      return "🐌";
    } else if (speed < 2) {
      return "🚶";
    } else if (speed < 3) {
      return "🏃‍♀️";
    } else if (speed < 4) {
      return "🚴";
    } else if (speed < 5) {
      return "🛵";
    } else if (speed < 6) {
      return "🏍";
    } else if (speed < 7) {
      return "🚙";
    } else if (speed < 8) {
      return "🚓";
    } else if (speed < 9) {
      return "✈️";
    } else if (speed <= 10) {
      return "🚀";
    }
  }

  render() {
    const speedIcon: CSS.Properties = {
      width: '20px',
      height: '20px',
      display: 'inline-flex',
      lineHeight: '40px',
    }

    const lottieStyles: CSS.Properties = {
      boxShadow: '0 0 14px 1px #444',
      backgroundColor: `rgba(255,255,255,${1 - this.animationsQueue.length/2})`
    }

    const { playingState, direction, config, speed, segments } = this.state;

    return (
      <>
        <h1>Animations queue:</h1>
        <Lottie
          config={config}
          height="350px"
          width='350px'
          style={lottieStyles}
          playingState={playingState}
          speed={speed}
          segments={segments}
          className="lottie-container"
          direction={direction}
          lottieEventListeners={[
            { callback: () => console.log('\'DOMLoaded\' event callback triggered '), name: 'DOMLoaded' },
            { callback: () => { console.log('\'complete\' event callback triggered '); this.nextAnimation() }, name: 'complete' },
          ]}
        />
        <p style={{ textAlign: 'center' }}>
          Queue: {this.animationsQueue.length}
          <br />
          Speed:&nbsp;
          <span style={speedIcon}>{this.getSpeedIcon(speed)}</span>
          <span style={speedIcon}>{speed.toFixed(1)}</span>
        </p>
        <p>
          <input
            type="range" value={speed} min="0" max="10" step="0.5"
            onChange={e => this.setState({ speed: parseFloat(e.currentTarget.value) || 0 })}
          />
        </p>
        <p>
          <input type="button" value="Start" onClick={this.setPlaying} />
          <input type="button" value="Pause" onClick={this.setPaused} />
          <input type="button" value="Stop" onClick={this.setStopped} />
          <input type="button" value="Next" onClick={this.nextAnimation} />
        </p>
        {segments && <p >Segment range: {JSON.stringify(segments)}</p>}
      </>
    );
  }
}

