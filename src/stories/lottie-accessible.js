import React from 'react';
import Lottie from '../index';
import animationData from './pinjump.json';

const paragraphStyle = {
  fontSize: 18,
  lineHeight: 1.6,
  maxWidth: 520,
  margin: '40px auto',
};

/* `as="span"` keeps the markup valid inside a paragraph, `tabIndex={-1}`
   takes a presentational animation out of the tab order, and `ariaRole="img"`
   exposes it as an image described by `ariaLabel` (issues #73, #130). */
export default function LottieAccessible() {
  return (
    <p style={paragraphStyle}>
      An animation can sit inside a sentence
      {' '}
      <Lottie
        as="span"
        options={{ animationData, loop: true, autoplay: true }}
        height={40}
        width={40}
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
        ariaRole="img"
        ariaLabel="A pin bouncing"
        tabIndex={-1}
        isClickToPauseDisabled
      />
      {' '}
      without breaking the paragraph markup, the tab order or the screen reader
      output.
    </p>
  );
}
