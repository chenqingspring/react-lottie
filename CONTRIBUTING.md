# Contributing to React Lottie Component

We welcome your help to make this component better. This document will help to streamline the contributing process and save everyone's precious time.

## Development Setup

This component has been setup with [React CDK](https://github.com/kadirahq/react-cdk). Refer [React CDK documentation](https://github.com/kadirahq/react-cdk)) to get started with the development.

Use npm: `package-lock.json` is the only lockfile and CI installs with `npm ci`.
The security override in `package.json#overrides` is npm-specific, so do not add
a `yarn.lock` (a Yarn 1 lockfile would silently re-resolve to the vulnerable
`minimatch` 10.x line).

## Before you release

`npm test` exercises `src/`, but consumers load the packed tarball's
`dist/index.js` under their own React. Build first, then run the publish gate:

```bash
npm run prepublish   # builds dist/ and verifies its runtime deps
npm run smoke:packed # packs, installs the tarball with the newest React 19, renders it
```

`npm run smoke:packed` catches failures that unit tests cannot see: a missing
build step, a changed CommonJS export shape, an undeclared runtime dependency,
and React-version regressions (the peer range is `react >=16.8.0`, while the dev
environment pins React 18). CI runs it in the `package-smoke` job.
