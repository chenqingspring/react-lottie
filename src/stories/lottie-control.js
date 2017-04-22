import React from 'react'
import Lottie from '../index';
import * as animationData from './pinjump.json'

export default class LottieControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isStopped: false};
  }

  render() {
    const buttonStyle = {
      display: 'block',
      margin: '10px auto'
    };

    const defaultOptions = {animationData: animationData};
    return <div>
      <Lottie options={defaultOptions} height={400} width={400} isStopped={this.state.isStopped}/>
      <button style={buttonStyle} onClick={() => this.setState({isStopped: true})}>stop</button>
      <button style={buttonStyle} onClick={() => this.setState({isStopped: false})}>play</button>
    </div>
  }
}
