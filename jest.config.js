module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest/setup.js'],
  // The RN preset's pattern only matches flat node_modules. pnpm nests packages
  // under node_modules/.pnpm/…, so allow those paths to be transformed as well.
  transformIgnorePatterns: [
    'node_modules/(?!(\\.pnpm|(jest-)?react-native|@react-native(-community)?|@react-native-[a-z-]+|nativewind|react-native-[a-z-]+)/)',
  ],
};
