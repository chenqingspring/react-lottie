import React from 'react';
import Lottie from '../index';
import animationData from './pinjump.json';

/* The animation is square (150x150); the boxes are wider, so `meet`
   letterboxes it while `slice` fills the box and crops the sides.
   `rendererSettings` belongs inside `options`, not on `<Lottie />` (#98). */
const boxStyle = {
  width: 320,
  height: 180,
  border: '1px dashed #cbd5e1',
  margin: 0,
};

const panelStyle = {
  display: 'inline-block',
  margin: 12,
  verticalAlign: 'top',
  fontFamily: 'sans-serif',
  fontSize: 13,
  color: '#334155',
};

const modes = [
  { label: 'xMidYMid meet (default) — letterboxed', value: 'xMidYMid meet' },
  { label: 'xMidYMid slice — fills and crops', value: 'xMidYMid slice' },
  { label: 'none — stretched', value: 'none' },
];

export default function LottieRendererSettings() {
  return (
    <div>
      {modes.map(mode => (
        <div key={mode.value} style={panelStyle}>
          <Lottie
            options={{
              animationData,
              loop: true,
              autoplay: true,
              rendererSettings: { preserveAspectRatio: mode.value },
            }}
            height={180}
            width={320}
            style={boxStyle}
          />
          <p>{mode.label}</p>
        </div>
      ))}
    </div>
  );
}
