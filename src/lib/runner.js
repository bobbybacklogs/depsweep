const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function readPackageJson(dir) {
  const p = path.join(dir, 'package.json');
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return null;
  }
}

// Build an `npm ...` command string, forwarding any supported flags.
// `--json` is appended first so it survives even if a trailing option
// swallows the rest of the line.
function npmCmd(base, args = []) {
  return [base, ...args].filter(Boolean).join(' ');
}

function run(cmd, cwd, { quiet = false } = {}) {
  try {
    return execSync(cmd, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', quiet ? 'ignore' : 'pipe', 'pipe'],
    });
  } catch (e) {
    return e.stdout || '';
  }
}

module.exports = { readPackageJson, run, npmCmd };
