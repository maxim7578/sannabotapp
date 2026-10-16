/**
 * Babel plugin (test env only): rewrites Metro's `require.context(dir, deep, re)`
 * to a Node implementation that reads matching files from disk.
 */
const path = require('path');

const polyfillPath = path.join(__dirname, 'require-context.js');

module.exports = function requireContextPlugin({ types: t }) {
  return {
    name: 'jest-require-context',
    visitor: {
      CallExpression(nodePath) {
        const callee = nodePath.get('callee');
        if (
          !callee.isMemberExpression() ||
          !t.isIdentifier(callee.node.object, { name: 'require' }) ||
          !t.isIdentifier(callee.node.property, { name: 'context' })
        ) {
          return;
        }
        nodePath.replaceWith(
          t.callExpression(
            t.callExpression(t.identifier('require'), [t.stringLiteral(polyfillPath)]),
            [t.identifier('__dirname'), ...nodePath.node.arguments],
          ),
        );
      },
    },
  };
};
