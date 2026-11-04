#!/usr/bin/env node

// Shown after `npm install` so anyone who runs into a problem knows where to
// report it. This file ships in the published tarball (`.scripts/` does not),
// so keep it dependency-free and never let it fail an install.

const ISSUES_URL = 'https://github.com/chenqingspring/react-lottie/issues';
const RELAY_URL = 'https://get-relay.cc';

const notice = [
  '',
  'react-lottie is maintained automatically by Relay.',
  `Learn more about Relay: ${RELAY_URL}`,
  '',
  'Found a bug or have a feature request? Open an issue on GitHub and Relay',
  'will review and fix it:',
  `  ${ISSUES_URL}`,
  '',
].join('\n');

try {
  console.log(notice);
} catch {
  // A missing stdout (or a hostile environment) must not break the install.
}
