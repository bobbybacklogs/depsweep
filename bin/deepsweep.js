#!/usr/bin/env node
const { program } = require('commander');
const pkg = require('../package.json');

program
  .name('deepsweep')
  .description('Scan projects for outdated and vulnerable npm dependencies')
  .version(pkg.version);

program
  .command('scan')
  .description('Scan a project for outdated and vulnerable dependencies')
  .option('-d, --directory <path>', 'directory to scan', process.cwd())
  .option('-g, --global', 'include global npm packages')
  .option('-q, --quiet', 'suppress non-essential output')
  .option('-e, --exclude <packages>', 'exclude packages')
  .option('-t, --threshold <level>', 'vulnerability severity threshold', 'low')
  .action(require('../src/commands/scan'));

program
  .command('update')
  .description('Update dependencies to latest secure versions')
  .option('-d, --directory <path>', 'directory to update', process.cwd())
  .option('-f, --force', 'force update')
  .option('-b, --backup', 'backup before changes')
  .option('-u, --update-lockfile', 'update lockfile')
  .action(require('../src/commands/update'));

program
  .command('fix')
  .description('Fix security issues in project')
  .option('-d, --directory <path>', 'directory to fix', process.cwd())
  .option('-f, --force', 'force fix')
  .action(require('../src/commands/fix'));

program
  .command('report')
  .description('Generate comprehensive report')
  .option('-d, --directory <path>', 'directory', process.cwd())
  .option('-r, --report <file>', 'report file')
  .action(require('../src/commands/report'));

program.parse();
