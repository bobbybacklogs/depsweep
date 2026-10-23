const { chalk } = require('../lib/chalk');
const fs = require('fs');
const { readPackageJson, run, npmCmd } = require('../lib/runner');

module.exports = (opts) => {
  const dir = opts.directory || process.cwd();
  const pkg = readPackageJson(dir);

  const outdatedArgs = ['--json'];
  if (opts.global) outdatedArgs.push('--global');
  const outdated = run(npmCmd('npm outdated', outdatedArgs), dir);

  const report = { project: pkg && pkg.name, directory: dir, outdated: {}, audit: {} };
  try { report.outdated = JSON.parse(outdated || '{}'); } catch (e) {}
  if (!opts.global) {
    // `npm audit` does not support global packages.
    const audit = run(npmCmd('npm audit', ['--json']), dir);
    try { report.audit = JSON.parse(audit || '{}'); } catch (e) {}
  }
  const text = JSON.stringify(report, null, 2);
  if (opts.report) {
    fs.writeFileSync(opts.report, text);
    console.log(chalk.green('Report written to ' + opts.report));
  } else {
    console.log(text);
  }
};
