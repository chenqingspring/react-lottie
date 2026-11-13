import React, { useState } from 'react';
import Lottie from '../index';
import animationData from './pinjump.json';

/* `renderer` lives inside `options` and defaults to `svg`. Switching it on a
   mounted component regenerates the animation with the other engine and keeps
   the current frame, so the toggle below does not restart the animation.
   The full lottie-web player is required: the light builds register a single
   renderer. */
const boxStyle = {
  width: 240,
  height: 240,
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

const renderers = ['svg', 'canvas'];

export default function LottieRenderer() {
  const [renderer, setRenderer] = useState('svg');

  /* Remount the animation when the story is re-entered so a stale canvas does
     not keep playing after the other panels load. */
  const [run, setRun] = useState(0);

  return (
    <div>
      <div style={panelStyle}>
        <Lottie
          key={run}
          options={{ animationData, loop: true, autoplay: true, renderer }}
          height={240}
          width={240}
          style={boxStyle}
        />
        <p>
          Live: <code>{renderer}</code> renderer
        </p>
        <p>
          {renderers.map(name => (
            <button
              key={name}
              type="button"
              onClick={() => setRenderer(name)}
              disabled={name === renderer}
            >
              {name}
            </button>
          ))}
          <button type="button" onClick={() => setRun(run + 1)}>
            restart
          </button>
        </p>
        <p>
          Switching keeps the current frame and play state; the animation is
          regenerated with the new engine instead of restarting.
        </p>
      </div>
      <div style={panelStyle}>
        <p>Reference: each renderer on its own component</p>
        {renderers.map(name => (
          <div key={name} style={{ marginBottom: 12 }}>
            <Lottie
              options={{ animationData, loop: true, autoplay: true, renderer: name }}
              height={120}
              width={120}
              style={{ ...boxStyle, width: 120, height: 120 }}
            />
            <p>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
