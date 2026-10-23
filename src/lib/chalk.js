const chalk = require('chalk').default || require('chalk');

// Disable ANSI color codes for `--no-color`. Mutating the shared `level` is
// intentional: every module that imports this file receives the same chalk
// instance, so the change applies to all command output.
function disableColor() {
  chalk.level = 0;
}

module.exports = { chalk, disableColor };
