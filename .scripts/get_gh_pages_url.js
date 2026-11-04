// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.

// Accepts the same values git does: git@github.com:owner/repo.git,
// https://github.com/owner/repo(.git), ssh://git@github.com/owner/repo.
var ghUrl = process.argv[2];

if (!ghUrl) {
  console.error('Usage: node .scripts/get_gh_pages_url.js <git-remote-url>');
  process.exit(1);
}

var cleaned = ghUrl.replace(/\.git$/, '').replace(/\/$/, '');
var parts = cleaned.split(/[/:]/).filter(Boolean);
var name = parts.pop();
var owner = parts.pop();

console.log('https://' + owner + '.github.io/' + name);
