const { chalk } = require('../lib/chalk');
const { readPackageJson, run, npmCmd } = require('../lib/runner');

const SEVERITY_LEVELS = ['info', 'low', 'moderate', 'high', 'critical'];

module.exports = (opts) => {
  const dir = opts.directory || process.cwd();

  // `--global` scans the globally installed packages instead of a project,
  // so a local package.json is not required in that mode.
  if (!opts.global) {
    const pkg = readPackageJson(dir);
    if (!pkg) {
      console.error(chalk.red('No package.json found in ' + dir));
      process.exit(1);
    }
  }

  const quiet = !!opts.quiet;
  const thresholdIdx = SEVERITY_LEVELS.indexOf(opts.threshold || 'low');

  if (!quiet) console.log(chalk.cyan('Scanning ' + (opts.global ? 'global packages' : dir) + '...'));

  const outdatedArgs = ['--json'];
  if (opts.global) outdatedArgs.push('--global');
  const outdated = run(npmCmd('npm outdated', outdatedArgs), dir, { quiet });
  let data = {};
  try { data = JSON.parse(outdated || '{}'); } catch (e) { data = {}; }

  // `--exclude` accepts a comma- or space-separated list of package names.
  const excludes = new Set(
    (opts.exclude || '')
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
  );

  const entries = Object.entries(data).filter(([name]) => !excludes.has(name));
  if (entries.length === 0) {
    if (!quiet) console.log(chalk.green('All dependencies up to date.'));
  } else {
    if (!quiet) console.log(chalk.yellow('Outdated dependencies:'));
    for (const [name, info] of entries) {
      if (!quiet) console.log(`  ${name}: ${info.current} -> ${info.latest} (${info.wanted})`);
    }
  }

  if (opts.global) {
    // `npm audit` does not support global packages, so nothing left to check.
    return;
  }

  const audit = run(npmCmd('npm audit', ['--json']), dir, { quiet });
  try {
    const a = JSON.parse(audit || '{}');
    const vulns = (a.metadata && a.metadata.vulnerabilities) || {};
    const atOrAbove = Object.entries(vulns).filter(([level, count]) => {
      const idx = SEVERITY_LEVELS.indexOf(level);
      return idx >= thresholdIdx && count > 0;
    });
    if (atOrAbove.length === 0) {
      if (!quiet) console.log(chalk.green('No vulnerabilities at or above "' + (opts.threshold || 'low') + '" severity.'));
    } else {
      if (!quiet) {
        console.log(chalk.cyan('Vulnerabilities:'));
        for (const [level, count] of atOrAbove) {
          const color = level === 'critical' || level === 'high' ? chalk.red : chalk.yellow;
          console.log(`  ${level}: ${color(String(count))}`);
        }
      }
    }
  } catch (e) {
    // ignore unparseable audit output
  }
};
