import React, { useRef, useState } from 'react';
import Lottie from '../index';
import animationData from './pinjump.json';

/* `loop` lives inside `options` and defaults to `true`. Changing it on a
   mounted component does not reload the animation, so the toggle below keeps
   the current frame and play state: switch it off while the animation is
   running and it finishes the current pass, then stops. */
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

const modes = [
  { label: 'loop forever', value: true },
  { label: 'play once', value: false },
  { label: 'play 3 times', value: 3 },
];

export default function LottieLoop() {
  const [loop, setLoop] = useState(true);
  const animationRef = useRef(null);

  return (
    <div>
      <div style={panelStyle}>
        <Lottie
          ref={animationRef}
          options={{ animationData, loop, autoplay: true }}
          height={240}
          width={240}
          style={boxStyle}
        />
        <p>
          Live: <code>loop: {String(loop)}</code>
        </p>
        <p>
          {modes.map(mode => (
            <button
              key={mode.label}
              type="button"
              onClick={() => setLoop(mode.value)}
              disabled={mode.value === loop}
            >
              {mode.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => animationRef.current.goToAndPlay(0, true)}
          >
            restart
          </button>
        </p>
        <p>
          Switching to <code>play once</code> mid-flight lets the current pass
          finish and then stops; <code>restart</code> replays it.
        </p>
      </div>
    </div>
  );
}
