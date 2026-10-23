const { chalk } = require('../lib/chalk');
const { readPackageJson, run, npmCmd } = require('../lib/runner');

module.exports = (opts) => {
  const dir = opts.directory || process.cwd();

  // `npm audit` does not support global packages.
  if (opts.global) {
    console.error(chalk.red('The fix command does not support global packages.'));
    process.exit(1);
  }

  const pkg = readPackageJson(dir);
  if (!pkg) {
    console.error(chalk.red('No package.json found in ' + dir));
    process.exit(1);
  }

  console.log(chalk.cyan('Fixing security issues in ' + dir + '...'));
  const args = opts.force ? ['--force'] : [];
  const out = run(npmCmd('npm audit fix', args), dir);
  console.log(out);
  if (/up to date|fixed 0 of|no vulnerabilities/i.test(out)) {
    console.log(chalk.green('No fixes were needed.'));
  } else {
    console.log(chalk.green('Done.'));
  }
};
