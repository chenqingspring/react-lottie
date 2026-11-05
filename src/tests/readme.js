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

  // Issue #39: `segments` shipped in #31 without any documentation.
  // https://github.com/chenqingspring/react-lottie/issues/39
  it('documents how to play a segment', () => {
    expect(readme).to.contain('### Play a segment');
    expect(readme).to.contain('segments={[45, 90]}');
  });

  // Issue #142: a static JSON import inlines the animation into the JS bundle.
  // https://github.com/chenqingspring/react-lottie/issues/142
  it('documents how to avoid bundling large animation data', () => {
    expect(readme).to.contain('### Loading animation data without bloating the bundle');
    expect(readme).to.contain("path: '/animations/pinjump.json'");
    expect(readme).to.contain("import('./pinjump.json')");
  });

  // Issue #135: the published entry point is CommonJS, so a plain <script>
  // tag fails with "exports is not defined"; document the ESM CDN path.
  it('documents how to use the package from a CDN without a bundler', () => {
    expect(readme).to.contain('## Using from a CDN (no bundler)');
    expect(readme).to.contain('exports is not defined');
    expect(readme).to.contain('https://esm.sh/react-lottie@2?external=react');
  });

  // Guards the props table against drifting away from the component: every
  // prop in Lottie.propTypes must appear as a bold entry in the README.
  it('documents every prop the component accepts', () => {
    const source = fs.readFileSync(path.join(__dirname, '../index.js'), 'utf8');
    const propTypes = source.slice(source.indexOf('Lottie.propTypes'));
    const documented = propTypes.match(/^ {2}(\w+):/gm).map(line => line.trim().replace(':', ''));

    expect(documented).to.include('segments');

    const undocumented = documented.filter(prop => !readme.includes(`**${prop}**`));
    expect(undocumented).to.deep.equal([]);
  });
});
