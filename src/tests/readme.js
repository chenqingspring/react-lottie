import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

const { describe, it } = global;

// Issue #182: PR #180 injected "Live Demo" links pointing at jinno.io /
// jinno.app, a domain that redirects to a ransomware page. The links were
// reverted, but a README-only PR could slip them back in unnoticed.
// https://github.com/chenqingspring/react-lottie/issues/182
describe('README', () => {
  const readme = fs.readFileSync(path.join(__dirname, '../../README.md'), 'utf8');

  it('does not reference the malicious jinno demo domains', () => {
    expect(readme).to.not.match(/jinno\.(io|app)/i);
  });

  it('points the demo at the official GitHub Pages site', () => {
    expect(readme).to.contain('https://chenqingspring.github.io/react-lottie');
  });
});
