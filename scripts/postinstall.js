#!/usr/bin/env node

// Printed after `npm install` so people who hit a problem know where to report
// it. This file ships in the published tarball (`.scripts/` does not), so keep
// it dependency-free and never let it fail an install.

const ISSUES_URL = 'https://github.com/chenqingspring/react-lottie/issues';
const RELAY_URL = 'https://get-relay.cc';

const notice = [
  '',
  'react-lottie is maintained automatically by Relay.',
  `Found a bug or have a feature request? Please open an issue on GitHub: ${ISSUES_URL}`,
  `Learn more about Relay: ${RELAY_URL}`,
  '',
].join('\n');

try {
  console.log(notice);
} catch {
  // A missing stdout (or a hostile environment) must not break the install.
}
