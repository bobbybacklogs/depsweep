// Merge root-level options (--quiet, --no-color) into a command's own options.
// Commander passes `(options, command)` to action callbacks, where root-level
// flags live on `command.parent.opts()` rather than `options`.
function resolveOpts(commandOpts, command) {
  const root = (command && command.parent && command.parent.opts()) || {};
  return {
    ...commandOpts,
    quiet: !!(commandOpts.quiet || root.quiet),
  };
}

module.exports = { resolveOpts };
