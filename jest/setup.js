/**
 * Jest setup: mocks for native modules that don't exist outside a device.
 */
/* eslint-env jest */

// ─── Third-party native modules ─────────────────────────────────────────────

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/documents',
  DownloadDirectoryPath: '/mock/downloads',
  CachesDirectoryPath: '/mock/caches',
  ExternalDirectoryPath: '/mock/external',
  exists: jest.fn(async () => false),
  readFile: jest.fn(async () => ''),
  writeFile: jest.fn(async () => {}),
  appendFile: jest.fn(async () => {}),
  mkdir: jest.fn(async () => {}),
  unlink: jest.fn(async () => {}),
  readDir: jest.fn(async () => []),
  stat: jest.fn(async () => ({})),
  downloadFile: jest.fn(() => ({ jobId: 1, promise: Promise.resolve({ statusCode: 200 }) })),
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(async () => true),
  getGenericPassword: jest.fn(async () => false),
  resetGenericPassword: jest.fn(async () => true),
  ACCESS_CONTROL: {},
  ACCESSIBLE: {},
  AUTHENTICATION_TYPE: {},
  SECURITY_LEVEL: {},
  STORAGE_TYPE: {},
}));

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
  refresh: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(async () => true),
    signIn: jest.fn(),
    signInSilently: jest.fn(),
    signOut: jest.fn(async () => null),
    addScopes: jest.fn(),
    getTokens: jest.fn(),
    getCurrentUser: jest.fn(() => null),
    hasPreviousSignIn: jest.fn(() => false),
  },
  statusCodes: {},
  isSuccessResponse: jest.fn(() => false),
  isErrorWithCode: jest.fn(() => false),
}));

jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  types: {},
  errorCodes: {},
  isErrorWithCode: jest.fn(() => false),
}));

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  setRNConfiguration: jest.fn(),
  requestAuthorization: jest.fn(),
}));

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(async () => ''),
}));

// ─── SannaBot's own Android native modules ──────────────────────────────────
// Every method resolves to null; event emitter hooks are no-ops.

const { NativeModules } = require('react-native');

function createNativeModuleMock() {
  const target = { addListener: jest.fn(), removeListeners: jest.fn() };
  return new Proxy(target, {
    get: (obj, prop) => {
      if (!(prop in obj)) {
        obj[prop] = jest.fn(async () => null);
      }
      return obj[prop];
    },
  });
}

[
  'AccessibilityJobModule',
  'AccessibilityModule',
  'AudioPlayerModule',
  'AudioRecorderModule',
  'BluetoothModule',
  'DeviceQueryModule',
  'IntentModule',
  'KeepAwakeModule',
  'NotificationListenerModule',
  'SchedulerModule',
  'SmsModule',
  'SpeechModule',
  'TimerModule',
  'TTSModule',
  'VolumeManager',
  'WakeWordModule',
].forEach(name => {
  NativeModules[name] = createNativeModuleMock();
});
