const { chalk } = require('../lib/chalk');
const { readPackageJson, run, npmCmd } = require('../lib/runner');
const fs = require('fs');
const path = require('path');

module.exports = (opts) => {
  const dir = opts.directory || process.cwd();
  const pkg = readPackageJson(dir);
  if (!pkg) {
    console.error(chalk.red('No package.json found in ' + dir));
    process.exit(1);
  }
  if (opts.backup) {
    const src = path.join(dir, 'package.json');
    const dst = path.join(dir, 'package.json.bak');
    fs.copyFileSync(src, dst);
    console.log(chalk.gray('Backup created: package.json.bak'));
  }
  console.log(chalk.cyan('Updating dependencies in ' + dir + '...'));
  const updateArgs = opts.force ? ['--force'] : [];
  const out = run(npmCmd('npm update', updateArgs), dir);
  console.log(out);
  if (opts.updateLockfile) {
    run(npmCmd('npm install', ['--package-lock-only']), dir);
    console.log(chalk.green('Lockfile updated.'));
  }
  console.log(chalk.green('Done.'));
};
