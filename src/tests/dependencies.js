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
