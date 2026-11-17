#!/usr/bin/env node

// Publish gate: the unit tests import `src/`, but consumers install the packed
// tarball and load `dist/index.js`. This script packs the package exactly like
// a release does, installs the tarball into a throwaway project together with
// the newest React 19 line (the peer range is `react >=16.8.0`, so React 19 is
// claimed support that the test suite, pinned to React 18, never exercises),
// and mounts a component through the published entry point.
//
// It catches the failures unit tests cannot see: a missing build step, a
// broken CommonJS export shape (`require('react-lottie').default` disappearing),
// an undeclared runtime dependency, and React-version regressions.
//
// Run `npm run prepublish` first: `dist/` is gitignored and not built by
// `npm pack` itself.

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.join(__dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const run = (args, cwd) =>
  execFileSync(npm, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });

const fail = (message) => {
  console.error(`error: ${message}`);
  process.exitCode = 1;
};

const animationData = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 30,
  w: 100,
  h: 100,
  nm: 'smoke',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'shape',
      sr: 1,
      ao: 0,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'rc', d: 1, s: { a: 0, k: [50, 50] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, nm: 'rect' },
            { ty: 'fl', c: { a: 0, k: [1, 0.4, 0.2, 1] }, o: { a: 0, k: 100 }, r: 1, nm: 'fill' },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: 'tr',
            },
          ],
        },
      ],
      ip: 0,
      op: 30,
      st: 0,
      bm: 0,
    },
  ],
};

const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'react-lottie-smoke-'));

process.on('exit', () => {
  fs.rmSync(projectDir, { recursive: true, force: true });
});

const main = async () => {
  if (!fs.existsSync(path.join(root, 'dist/index.js'))) {
    fail('dist/index.js does not exist; run `npm run prepublish` first.');
    return;
  }

  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify({ name: 'react-lottie-smoke', version: '0.0.0', private: true }, null, 2),
  );

  console.log('=> Packing the package ...');
  const packed = JSON.parse(run(['pack', '--pack-destination', projectDir, '--json'], root));
  const tarball = path.join(projectDir, packed[0].filename);
  console.log(`=> ${packed[0].filename} (${packed[0].files.length} files, ${packed[0].size} bytes)`);

  console.log('=> Installing the tarball with the newest React 19 ...');
  try {
    run(
      [
        'install',
        tarball,
        'react@19',
        'react-dom@19',
        'jsdom',
        '--no-audit',
        '--no-fund',
        '--ignore-scripts',
      ],
      projectDir,
    );
  } catch (error) {
    fail(`installing the tarball failed:\n${error.stderr || error.message}`);
    return;
  }

  const entry = path.join(projectDir, 'node_modules/react-lottie');
  const installed = JSON.parse(fs.readFileSync(path.join(entry, 'package.json'), 'utf8'));
  console.log(`=> Installed react-lottie@${installed.version}; entry ${installed.main}`);

  // lottie-web probes canvas support at import time; jsdom has no 2d backend.
  const noop = () => {};
  const context2d = new Proxy(
    {
      measureText: () => ({ width: 0 }),
      getImageData: (x, y, width, height) => ({
        data: new Uint8ClampedArray(Math.max(1, width * height * 4)),
        width,
        height,
      }),
      createLinearGradient: () => ({ addColorStop: noop }),
      createRadialGradient: () => ({ addColorStop: noop }),
    },
    {
      get: (target, key) => (key in target ? target[key] : noop),
      set: (target, key, value) => {
        target[key] = value;
        return true;
      },
    },
  );

  const { JSDOM } = require(path.join(projectDir, 'node_modules/jsdom'));
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
  dom.window.HTMLCanvasElement.prototype.getContext = () => context2d;
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  Object.defineProperty(global, 'navigator', {
    value: { userAgent: 'node.js' },
    configurable: true,
  });
  global.requestAnimationFrame = (callback) => setTimeout(callback, 16);
  global.cancelAnimationFrame = (id) => clearTimeout(id);

  const react = require(path.join(projectDir, 'node_modules/react'));
  const { createRoot } = require(path.join(projectDir, 'node_modules/react-dom/client'));
  const entryModule = require(entry);
  const Lottie = entryModule.default || entryModule;

  if (typeof Lottie !== 'function' && typeof Lottie !== 'object') {
    fail(`the published entry point exports ${typeof Lottie} instead of a component`);
    return;
  }

  console.log(`=> Rendering with react@${react.version} ...`);

  const errors = [];
  const originalError = console.error;
  console.error = (...args) => errors.push(args.map(String).join(' '));

  const events = [];
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root_ = createRoot(container);
  root_.render(
    require(path.join(projectDir, 'node_modules/react')).createElement(Lottie, {
      options: {
        loop: true,
        autoplay: false,
        animationData,
        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
      },
      height: 100,
      width: 100,
      isStopped: true,
      eventListeners: [{ eventName: 'DOMLoaded', callback: () => events.push('DOMLoaded') }],
    }),
  );

  await new Promise((resolve) => setTimeout(resolve, 800));
  console.error = originalError;

  const svg = container.querySelector('svg');
  root_.unmount();

  const problems = [];
  if (!svg) problems.push('no <svg> element was rendered');
  if (!events.includes('DOMLoaded')) problems.push('the DOMLoaded event never fired');
  if (errors.length > 0) problems.push(`console.error was called ${errors.length} time(s): ${errors[0]}`);

  if (problems.length > 0) {
    fail(`the packed package failed to render:\n  - ${problems.join('\n  - ')}`);
    return;
  }

  console.log(`=> Packed package rendered with react@${react.version}: OK`);
};

main()
  .catch((error) => {
    fail(error && error.stack ? error.stack : String(error));
  });
