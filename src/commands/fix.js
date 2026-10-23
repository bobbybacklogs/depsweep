const chalk = require('chalk').default || require('chalk');
const { run } = require('../lib/runner');

module.exports = (opts) => {
  const dir = opts.directory || process.cwd();
  console.log(chalk.cyan('Fixing security issues in ' + dir + '...'));
  const out = run('npm audit fix' + (opts.force ? ' --force' : ''), dir);
  console.log(out);
  console.log(chalk.green('Done.'));
};
