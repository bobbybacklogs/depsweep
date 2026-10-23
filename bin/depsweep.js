#!/usr/bin/env node
const { program } = require('commander');
const pkg = require('../package.json');
const { disableColor } = require('../src/lib/chalk');
const { resolveOpts } = require('../src/lib/opts');

// Commander action callbacks receive `(options, command)`; wrap command
// modules (which expect a single options object) with the merged options.
const act = (fn) => (commandOpts, command) => fn(resolveOpts(commandOpts, command));

program
  .name('depsweep')
  .description('Scan projects for outdated and vulnerable npm dependencies')
  .version(pkg.version)
  .option('-q, --quiet', 'suppress non-essential output')
  .option('-n, --no-color', 'disable colored output')
  .addHelpText('after', `
Examples:
  $ depsweep scan
  $ depsweep scan --global --threshold high
  $ depsweep update --backup --update-lockfile
  $ depsweep fix --force
  $ depsweep report --report depsweep-report.json
`);

// Apply --no-color before any command runs (it is a root-level option).
program.hook('preAction', () => {
  if (program.opts().color === false) disableColor();
});

program
  .command('scan')
  .description('Scan for outdated and vulnerable npm dependencies')
  .option('-d, --directory <path>', 'directory to scan', process.cwd())
  .option('-g, --global', 'scan globally installed npm packages')
  .option('-e, --exclude <packages>', 'comma-separated packages to exclude')
  .option('-t, --threshold <level>', 'vulnerability severity threshold (info, low, moderate, high, critical)', 'low')
  .action(act(require('../src/commands/scan')));

program
  .command('update')
  .description('Update dependencies to their latest secure versions')
  .option('-d, --directory <path>', 'directory to update', process.cwd())
  .option('-f, --force', 'force update even when no newer version is wanted')
  .option('-b, --backup', 'back up package.json before making changes')
  .option('-u, --update-lockfile', 'refresh the lockfile after updating')
  .action(act(require('../src/commands/update')));

program
  .command('fix')
  .description('Fix security issues with npm audit fix')
  .option('-d, --directory <path>', 'directory to fix', process.cwd())
  .option('-f, --force', 'apply potentially breaking fixes')
  .action(act(require('../src/commands/fix')));

program
  .command('report')
  .description('Generate a JSON report on dependency and security status')
  .option('-d, --directory <path>', 'directory to report on', process.cwd())
  .option('-g, --global', 'report on globally installed npm packages')
  .option('-r, --report <file>', 'write the report to a file instead of stdout')
  .action(act(require('../src/commands/report')));

// Show help when the user provides an unknown command or no command at all.
program.showHelpAfterError();
if (process.argv.length <= 2) {
  program.help();
}

program.parse();
