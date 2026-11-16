# Contributing to React Lottie Component

We welcome your help to make this component better. This document will help to streamline the contributing process and save everyone's precious time.

## Development Setup

This component has been setup with [React CDK](https://github.com/kadirahq/react-cdk). Refer [React CDK documentation](https://github.com/kadirahq/react-cdk)) to get started with the development.

Use npm: `package-lock.json` is the only lockfile and CI installs with `npm ci`.
The security override in `package.json#overrides` is npm-specific, so do not add
a `yarn.lock` (a Yarn 1 lockfile would silently re-resolve to the vulnerable
`minimatch` 10.x line).
