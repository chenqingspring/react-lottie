import React from 'react';
import bodymovin from 'bodymovin';

export default class Lottie extends React.Component {

  render() {
    const lottieStyles = {
      width: `${this.props.width}px` || '100%',
      height: `${this.props.height}px` || '100%',
      overflow: 'hidden',
      margin: '0 auto'
    };

    return <div ref='lavContainer' style={{...lottieStyles, ...this.props.style}}></div>;
  }

  componentDidMount() {
    this._options = {
      container: this.refs.lavContainer,
      renderer: 'svg',
      loop: this.props.options.loop !== false,
      autoplay: this.props.options.autoplay !== false,
      animationData: this.props.options.animationData
    };
    bodymovin.loadAnimation(this._options);
  }
}

Lottie.propTypes = {
  style: React.PropTypes.object,
  options: React.PropTypes.object.isRequired,
  height: React.PropTypes.number,
  width: React.PropTypes.number
};
