import React, { Component } from 'react';
import spinnerLottieData from './lotties/spinner-animation.json';
import vanLottieData from './lotties/11562-van-icon.json';
import downloadLottieData from './lotties/11599-download.json';
import lightBulbLottieData from './lotties/3520-light-bulb.json';
import loadingLottieData from './lotties/142-loading-animation.json';

import { Lottie, ReactLottieOwnProps } from './reactComponentLib';

class App extends Component<any, ReactLottieOwnProps> {
  prevSpeed: number;
  animationsQueue = [
    spinnerLottieData,
    vanLottieData,
    downloadLottieData,
    vanLottieData,
    loadingLottieData,
    lightBulbLottieData,
  ];

  constructor(props: any) {
    super(props);
    this.state = {
      config: { animationData: spinnerLottieData },
      playingState: 'playing',
      speed: 2,
      direction: 1,
    };
  }

  componentDidMount() {
    this.nextAnimation();
  }

  restrart = () => {
    this.setState({ playingState: 'playing' });
  }

  setStart = () => {
    this.setState({ playingState: 'playing' })
  }
  setPause = () => {
    this.setState({ playingState: 'paused' })
  }
  setStop = () => {
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

  reverseDirection = () => {
    this.setState(prevState => ({
      direction: prevState.direction > 0 ? -1 : 1
    }));
  }

  render() {
    const centerStyle = {
      display: 'block',
      margin: '10px auto',
      textAlign: 'center' as const,
    };
    const lottieStyles = {
      overflow: 'hidden',
      margin: '0 auto',
      outline: 'none',
    }
    const { playingState, direction, config, speed, segments } = this.state;
    return (<div
      onClick={this.reverseDirection}
    >
      <Lottie
        config={config}
        height="400px"
        width='100%'
        style={lottieStyles}
        playingState={playingState}
        speed={speed}
        segments={segments}
        direction={direction}
        eventListeners={[
          { callback: () => console.log('DOMLoaded event'), name: 'DOMLoaded' },
          { callback: this.nextAnimation, name: 'complete' },
        ]}
      />

      <p style={centerStyle}>Controls:</p>
      <div style={centerStyle}>
        <input type="button" value="Start" onClick={this.setStart} />
        <input type="button" value="Pause" onClick={this.setPause} />
        <input type="button" value="Stop" onClick={this.setStop} />
        <input type="button" value="Next" onClick={this.nextAnimation} />
      </div>
      <p style={centerStyle}>Speed: x{speed}</p>
      <input
        style={centerStyle}
        type="range" value={speed} min="0" max="10" step="0.5"
        onChange={e => this.setState({ speed: parseFloat(e.currentTarget.value) || 1 })}
      />
      {segments && <p style={centerStyle}>Segment range: {JSON.stringify(segments)}</p>}
    </div>);
  }
}

export default App;
