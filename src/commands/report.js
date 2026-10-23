const chalk = require('chalk').default || require('chalk');
const fs = require('fs');
const { readPackageJson, run } = require('../lib/runner');

module.exports = (opts) => {
  const dir = opts.directory || process.cwd();
  const pkg = readPackageJson(dir);
  const outdated = run('npm outdated --json', dir);
  const audit = run('npm audit --json', dir);
  const report = { project: pkg && pkg.name, directory: dir, outdated: {}, audit: {} };
  try { report.outdated = JSON.parse(outdated || '{}'); } catch (e) {}
  try { report.audit = JSON.parse(audit || '{}'); } catch (e) {}
  const text = JSON.stringify(report, null, 2);
  if (opts.report) {
    fs.writeFileSync(opts.report, text);
    console.log(chalk.green('Report written to ' + opts.report));
  } else {
    console.log(text);
  }
};
