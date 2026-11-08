import fs from 'fs';
import path from 'path';
import { builtinModules } from 'module';
import { expect } from 'chai';

const { describe, it } = global;

// Issue #148: `prop-types` is imported by the production source but used to be
// declared only as a devDependency, so consumers could hit a missing module at
// runtime. Keep every module imported by the shipped entry point declared as a
// runtime dependency (or a peer dependency the consumer installs).
// https://github.com/chenqingspring/react-lottie/issues/148
describe('runtime dependencies', () => {
  const root = path.join(__dirname, '../..');
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const source = fs.readFileSync(path.join(__dirname, '../index.js'), 'utf8');

  const packageName = (specifier) => {
    const parts = specifier.split('/');
    return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
  };

  const imports = [...source.matchAll(/^import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/gm)]
    .map(match => packageName(match[1]))
    .filter(name => !name.startsWith('.') && !name.startsWith('/'))
    .filter(name => !builtinModules.includes(name));

  it('declares prop-types as a runtime dependency', () => {
    expect(imports).to.include('prop-types');

    const runtime = { ...pkg.dependencies, ...pkg.peerDependencies };
    expect(runtime).to.have.property('prop-types');
  });

  it('declares every module imported by the production source', () => {
    const runtime = { ...pkg.dependencies, ...pkg.peerDependencies };
    const undeclared = imports.filter(name => !runtime[name]);

    expect(undeclared).to.deep.equal([]);
  });
});

// Issue #87: 1.x declared `"engines": { "npm": "^3.0.0" }`, so npm 6 and newer
// printed an `Unsupported engine` warning for every consumer. 2.x removed the
// field; keep it absent so installing with a modern npm stays clean.
// https://github.com/chenqingspring/react-lottie/issues/87
describe('npm engine constraint', () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8')
  );

  it('does not restrict the npm version', () => {
    const npmRange = pkg.engines && pkg.engines.npm;

    expect(
      npmRange,
      `package.json should not declare an npm engine, got "${npmRange}"`
    ).to.equal(undefined);
  });
});

// Issue #125: 1.x pinned `react` to `^16.0.0`, so React 17 consumers had to
// install with --legacy-peer-deps or --force. Keep the 2.x range open-ended so
// React 17 and newer stay installable without flags.
// https://github.com/chenqingspring/react-lottie/issues/125
describe('react peer dependency', () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8')
  );

  it('allows React 17 and newer', () => {
    const range = pkg.peerDependencies.react;
    expect(range, 'package.json declares a react peer dependency').to.be.a('string');

    const lowerBound = /^>=\s*(\d+)\.(\d+)\.(\d+)$/.exec(range.trim());
    expect(
      lowerBound,
      `react peer range should be open-ended (">=x.y.z"), got "${range}"`
    ).to.not.equal(null);
    expect(
      Number(lowerBound[1]),
      `react peer range "${range}" excludes React 17`
    ).to.be.at.most(17);
  });
});
