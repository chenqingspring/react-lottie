import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { expect } from 'chai';

const { describe, it } = global;

// The install notice is the first thing a new user sees after
// `npm install react-lottie`. Keep it in English, keep it pointing at the
// issue tracker and the Relay site, and keep the script in the published
// tarball (`.scripts/` is npmignored, so the file lives in `scripts/`).
describe('install notice', () => {
  const root = path.join(__dirname, '../..');
  const script = path.join(root, 'scripts/postinstall.js');
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

  const run = () => execFileSync(process.execPath, [script], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
  });

  it('is wired to the postinstall hook', () => {
    expect(pkg.scripts.postinstall).to.equal('node scripts/postinstall.js');
    expect(fs.existsSync(script)).to.equal(true);
  });

  it('prints an English notice with Relay, the issue tracker and the project URL', () => {
    const output = run();

    expect(output).to.contain('react-lottie is maintained automatically by');
    expect(output).to.contain('https://github.com/chenqingspring/react-lottie/issues');
    expect(output).to.contain('https://get-relay.cc');
    expect(output).to.not.match(/[\u4e00-\u9fff]/);
  });

  it('leaves the output plain when NO_COLOR is set', () => {
    expect(run()).to.not.contain('\u001b[');
  });
});
