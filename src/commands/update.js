const chalk = require('chalk').default || require('chalk');
const { readPackageJson, run } = require('../lib/runner');
const fs = require('fs');
const path = require('path');

module.exports = (opts) => {
  const dir = opts.directory || process.cwd();
  if (opts.backup) {
    const src = path.join(dir, 'package.json');
    const dst = path.join(dir, 'package.json.bak');
    fs.copyFileSync(src, dst);
    console.log(chalk.gray('Backup created: package.json.bak'));
  }
  console.log(chalk.cyan('Updating dependencies in ' + dir + '...'));
  const out = run('npm update', dir);
  console.log(out);
  if (opts.updateLockfile) {
    run('npm install --package-lock-only', dir);
    console.log(chalk.green('Lockfile updated.'));
  }
  console.log(chalk.green('Done.'));
};
