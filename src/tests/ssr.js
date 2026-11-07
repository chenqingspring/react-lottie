import { execFileSync } from 'child_process';
import path from 'path';
import { expect } from 'chai';

const { describe, it } = global;

const projectRoot = path.join(__dirname, '../..');

/* Issue #17: importing the package outside a browser used to throw
   "ReferenceError: window is not defined". The mocha runner installs jsdom for
   every test, so render in a clean Node process that has no `window`. */
describe('server-side rendering', () => {
  it('renders the container in a Node process without a DOM', () => {
    const script = `
      require('@babel/register')({ rootMode: 'upward' });
      const React = require('react');
      const { renderToString } = require('react-dom/server');
      const Lottie = require('./src/index.js').default;

      const animationData = {
        v: '5.7.4', fr: 30, ip: 0, op: 60, w: 100, h: 100, layers: [],
      };
      const html = renderToString(React.createElement(Lottie, {
        options: { animationData, loop: true, autoplay: true },
        width: 100,
        height: 100,
      }));

      if (typeof window !== 'undefined') {
        throw new Error('window leaked into the SSR process');
      }
      process.stdout.write(html);
    `;

    const html = execFileSync(process.execPath, ['-e', script], {
      cwd: projectRoot,
      encoding: 'utf8',
    });

    expect(html).to.contain('width:100px');
    expect(html).to.contain('height:100px');
    expect(html).to.contain('role="button"');
    expect(html).to.contain('aria-label="animation"');
  });
});
