#!/usr/bin/env node

// Shown after `npm install` so anyone who runs into a problem knows where to
// report it. This file ships in the published tarball (`.scripts/` does not),
// so keep it dependency-free and never let it fail an install.

const ISSUES_URL = 'https://github.com/chenqingspring/react-lottie/issues';
const RELAY_URL = 'https://get-relay.cc';

const ANSI = {
  reset: '\u001b[0m',
  bold: '\u001b[1m',
  cyan: '\u001b[36m',
};

// Colors make the banner pop in a terminal, but npm usually captures the
// script output, so the box frame alone has to carry the emphasis.
const colorEnabled = (() => {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR === '0') return false;
  if (process.env.TERM === 'dumb') return false;
  return Boolean(process.env.FORCE_COLOR) || Boolean(process.stdout && process.stdout.isTTY);
})();

const style = (text, ...codes) =>
  colorEnabled ? `${codes.join('')}${text}${ANSI.reset}` : text;

const accent = (text) => style(text, ANSI.bold, ANSI.cyan);

// Modern terminals render the rounded box; Windows consoles may not, so fall
// back to plain ASCII there.
const frame = process.platform === 'win32'
  ? { tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|' }
  : { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' };

const rows = [
  { plain: '', styled: '' },
  {
    plain: 'react-lottie is maintained automatically by RELAY',
    styled: `react-lottie is maintained automatically by ${accent('RELAY')}`,
  },
  {
    plain: `Learn more: ${RELAY_URL}`,
    styled: `Learn more: ${accent(RELAY_URL)}`,
  },
  { plain: '', styled: '' },
  {
    plain: 'Found a bug or have a feature request?',
    styled: 'Found a bug or have a feature request?',
  },
  {
    plain: 'Open an issue and RELAY will review and fix it:',
    styled: `Open an issue and ${accent('RELAY')} will review and fix it:`,
  },
  {
    plain: `  ${ISSUES_URL}`,
    styled: `  ${accent(ISSUES_URL)}`,
  },
];

const width = Math.max(...rows.map((row) => row.plain.length));
const horizontal = frame.h.repeat(width + 4);
const border = (text) => style(text, ANSI.cyan);

const notice = [
  '',
  border(`${frame.tl}${horizontal}${frame.tr}`),
  ...rows.map(({ plain, styled }) =>
    `${border(frame.v)}  ${styled}${' '.repeat(width - plain.length)}  ${border(frame.v)}`),
  border(`${frame.bl}${horizontal}${frame.br}`),
  '',
].join('\n');

try {
  console.log(notice);
} catch {
  // A missing stdout (or a hostile environment) must not break the install.
}
