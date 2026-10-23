const chalk = require('chalk').default || require('chalk');
const { readPackageJson, run } = require('../lib/runner');

module.exports = (opts) => {
  const dir = opts.directory || process.cwd();
  const pkg = readPackageJson(dir);
  if (!pkg) {
    console.error(chalk.red('No package.json found in ' + dir));
    process.exit(1);
  }
  console.log(chalk.cyan('Scanning ' + dir + '...'));
  const outdated = run('npm outdated --json', dir);
  let data = {};
  try { data = JSON.parse(outdated || '{}'); } catch (e) { data = {}; }
  const entries = Object.entries(data);
  if (entries.length === 0) {
    console.log(chalk.green('All dependencies up to date.'));
  } else {
    console.log(chalk.yellow('Outdated dependencies:'));
    for (const [name, info] of entries) {
      console.log(`  ${name}: ${info.current} -> ${info.latest} (${info.wanted})`);
    }
  }
  const audit = run('npm audit --json', dir);
  try {
    const a = JSON.parse(audit || '{}');
    const vulns = a.metadata && a.metadata.vulnerabilities ? a.metadata.vulnerabilities : {};
    console.log(chalk.cyan('Vulnerabilities:'), vulns);
  } catch (e) {
    // ignore
  }
};
