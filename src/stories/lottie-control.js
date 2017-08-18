import React from 'react'
import Lottie from '../index';
import * as animationData from './pinjump.json'

export default class LottieControl extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isStopped: false,
      isPaused: false,
      speed: 1,
      direction: 1,
    };

  }

  render() {
    const centerStyle = {
      display: 'block',
      margin: '10px auto',
      textAlign: 'center'
    };

    const defaultOptions = {animationData: animationData};

    let currentSpeed = this.state.speed;

    return <div>
      <Lottie options={defaultOptions}
              height={400}
              width={400}
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}
              speed={currentSpeed}
              direction={this.state.direction}/>

      <p style={centerStyle}>Speed: x{currentSpeed}</p>
      <input style={centerStyle}
             type="range" value={currentSpeed} min="0" max="3" step="0.5"
             onChange={(e) => this.setState({speed: e.currentTarget.value})}/>
      <button style={centerStyle} onClick={() => this.setState({isStopped: true})}>stop</button>
      <button style={centerStyle} onClick={() => this.setState({isStopped: false})}>play</button>
      <button style={centerStyle} onClick={() => this.setState({isPaused: !this.state.isPaused})}>pause</button>
      <button style={centerStyle} onClick={() => this.setState({direction: this.state.direction * -1})}>change direction</button>
    </div>
  }
}
