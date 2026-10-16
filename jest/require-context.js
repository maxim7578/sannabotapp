/**
 * Node implementation of Metro's require.context() for Jest.
 * Matching files are returned as raw strings (like the .md Metro transformer).
 */
const fs = require('fs');
const path = require('path');

module.exports = function requireContext(baseDir, directory, recursive = true, regExp = /^\.\//) {
  const root = path.resolve(baseDir, directory);
  const keys = [];

  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (recursive) {
          walk(full);
        }
      } else {
        const key = './' + path.relative(root, full).split(path.sep).join('/');
        if (regExp.test(key)) {
          keys.push(key);
        }
      }
    }
  })(root);

  const context = key => fs.readFileSync(path.join(root, key), 'utf8');
  context.keys = () => keys;
  return context;
};
