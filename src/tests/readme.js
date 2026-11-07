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

  // Issue #155 (and the duplicate #139): "is this project still maintained?"
  // keeps coming back because the repo went quiet for years. The README opens
  // with the current status, so removing that line silently would revive the
  // question; keep it pinned.
  it('states that the project is actively maintained', () => {
    expect(readme).to.contain('This project is fully maintained automatically by');
    expect(readme).to.contain('[Relay](https://get-relay.cc)');
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

  // Issues #49 and #59: animations exported with bitmap layers reference files
  // from the JSON's `assets` array, and the relative `u`/`p` paths break once
  // the app is served from a sub-path. Keep the assetsPath and import advice.
  it('documents how to ship animations that reference raster images', () => {
    expect(readme).to.contain('### Animations with raster images');
    expect(readme).to.contain("assetsPath: '/animations/images/'");
    expect(readme).to.contain('"e": 0');
    expect(readme).to.contain("asset.id === 'image_0' ? { ...asset, u: '', p: img0 }");
  });

  // Issue #79: importing react-lottie pulls in the full lottie-web build, which
  // is large because it contains every renderer and the expression engine.
  it('documents how to shrink the lottie-web bundle', () => {
    expect(readme).to.contain('### Shrinking the lottie-web bundle');
    expect(readme).to.contain("'lottie-web': 'lottie-web/build/player/lottie_light.js'");
    expect(readme).to.contain('lottie_light_canvas.js');
  });

  // Issue #133: large animations drop frames on iOS regardless of browser
  // (all of them are WebKit there); keep the renderer/size advice documented.
  it('documents performance tuning for large animations on iOS', () => {
    expect(readme).to.contain('### Performance on iOS and low-end devices');
    expect(readme).to.contain("renderer: 'canvas'");
    expect(readme).to.contain('dpr: 1');
    expect(readme).to.contain('IntersectionObserver');
    expect(readme).to.contain('progressiveLoad');
  });

  // Issue #128: render one of several animations depending on the page.
  // Changing options.animationData reloads in place; a new object on every
  // render reloads every time, and a `key` forces a full remount.
  it('documents how to switch between several animations', () => {
    expect(readme).to.contain('### Switch between several animations');
    expect(readme).to.contain('animationData: animations[page]');
    expect(readme).to.contain('<Lottie key={page}');
  });

  // Issue #129: navigating back and forth in a Gatsby app accumulated animation
  // nodes. The default `div` container was nested in a `<p>`, which the browser
  // reparents while parsing server-rendered HTML; keep the navigation and
  // hydration advice documented.
  it('documents page navigation and the nested-container hydration trap', () => {
    expect(readme).to.contain('### Animations and page navigation');
    expect(readme).to.contain('validateDOMNesting');
    expect(readme).to.contain('<Lottie as="span" options={defaultOptions} />');
  });

  // Issue #17: importing the package outside a browser used to throw
  // "ReferenceError: window is not defined". Keep the SSR guidance pinned.
  it('documents server-side rendering', () => {
    expect(readme).to.contain('### Server-side rendering');
    expect(readme).to.contain('ReferenceError: window is not defined');
    expect(readme).to.contain("{ ssr: false }");
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
