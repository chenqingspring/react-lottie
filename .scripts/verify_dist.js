#!/usr/bin/env node

// Issue #177: the published entry point used to require `babel-runtime`
// helpers that consumers did not have installed, so their builds failed with
// "Module not found: Can't resolve 'babel-runtime/helpers/...'". Babel 7 now
// inlines those helpers, and this check keeps the build honest: every bare
// module required by `dist` must be declared in package.json as a runtime,
// optional, or peer dependency.
// https://github.com/chenqingspring/react-lottie/issues/177

const fs = require('fs');
const path = require('path');
const { builtinModules } = require('module');

const root = path.join(__dirname, '..');
const distFile = path.join(root, 'dist/index.js');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const declared = {
  ...pkg.dependencies,
  ...pkg.optionalDependencies,
  ...pkg.peerDependencies,
};
const builtins = new Set(builtinModules);

const packageName = (specifier) => {
  const parts = specifier.split('/');
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
};

if (!fs.existsSync(distFile)) {
  console.error(`error: ${path.relative(root, distFile)} does not exist; build first.`);
  process.exit(1);
}

const source = fs.readFileSync(distFile, 'utf8');
const required = [...source.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)]
  .map((match) => match[1])
  .filter((specifier) => !specifier.startsWith('.') && !specifier.startsWith('/'))
  .filter((specifier) => !builtins.has(specifier))
  .map(packageName);

const undeclared = [...new Set(required)].filter((name) => !declared[name]);

if (undeclared.length > 0) {
  console.error(
    `error: dist requires modules that are not declared in package.json: ${undeclared.join(', ')}`,
  );
  process.exit(1);
}

console.log(`=> dist runtime dependencies verified: ${[...new Set(required)].sort().join(', ')}`);
