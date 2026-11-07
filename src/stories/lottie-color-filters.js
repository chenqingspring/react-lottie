import React from 'react';
import Lottie from '../index';
import animationData from './pinjump.json';

const centerStyle = {
  display: 'block',
  margin: '10px auto',
  textAlign: 'center',
};

const brandFilters = [
  { keypath: 'Pin 1.Shape 2.Fill 1', color: '#4f46e5' },
  { keypath: 'Pin 2.Shape 2.Fill 1', color: '#0ea5e9' },
  { keypath: '*.Ellipse 1.Fill 1', color: '#f59e0b' },
];

export default class LottieColorFilters extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      themed: false,
    };
  }

  render() {
    return (<div>
      <Lottie
        options={{ animationData, loop: true, autoplay: true }}
        height={400}
        width={400}
        colorFilters={this.state.themed ? brandFilters : []}
      />

      <button
        style={centerStyle}
        onClick={() => this.setState({ themed: !this.state.themed })}
      >toggle color filters</button>
    </div>);
  }
}
