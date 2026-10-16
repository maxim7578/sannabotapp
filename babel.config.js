module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    'nativewind/babel',
  ],
  env: {
    // Metro's require.context() does not exist in Jest – polyfill it via fs
    test: {
      plugins: ['./jest/babel-plugin-require-context'],
    },
  },
};
