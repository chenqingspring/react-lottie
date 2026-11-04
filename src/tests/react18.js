import React from 'react';
import { createRoot } from 'react-dom/client';
import { expect } from 'chai';
import ReactLottie from '../index';
import pinjump from '../stories/pinjump.json';

const { describe, it, afterEach } = global;

const options = {
  loop: true,
  autoplay: true,
  animationData: pinjump,
};

/* React 18 replaced ReactDOM.render with createRoot, and StrictMode mounts
   components twice to surface unsafe lifecycles. Issue #152 asked for React 18
   support, so keep both paths covered (2.x declares `react >=16.8.0`). */
describe('React 18 rendering', () => {
  let container;
  let root;

  const render = (element) => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    React.act(() => {
      root.render(element);
    });
    return container;
  };

  afterEach(() => {
    if (root) {
      React.act(() => {
        root.unmount();
      });
      root = null;
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    container = null;
  });

  it('mounts and unmounts through createRoot', () => {
    const element = render(<ReactLottie options={options} width={100} height={100} />);

    expect(element.querySelector('div')).to.not.equal(null);
    expect(element.querySelector('svg')).to.not.equal(null);

    React.act(() => {
      root.unmount();
    });
    root = null;

    expect(element.querySelector('div')).to.equal(null);
  });

  it('mounts cleanly inside StrictMode', () => {
    const element = render(
      <React.StrictMode>
        <ReactLottie options={options} width={100} height={100} />
      </React.StrictMode>
    );

    expect(element.querySelector('svg')).to.not.equal(null);
  });
});
