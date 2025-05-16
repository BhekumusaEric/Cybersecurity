/**
 * Jest configuration for Ethical Hacking LMS Mobile App
 *
 * This configuration file consolidates all Jest settings for the mobile app.
 */

module.exports = {
  // Use React Native preset
  preset: 'react-native',

  // File extensions to consider
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Setup files to run before each test
  setupFiles: ['./jest.setup.js'],

  // Ignore transforming node_modules except for specific packages
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@react-navigation/.*|@react-native-community/.*))',
  ],

  // Paths to ignore when searching for tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/e2e/',
  ],

  // Mock file imports
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/tests/__mocks__/fileMock.js',
  },

  // Collect coverage information
  collectCoverage: true,

  // Files to include in coverage report
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/tests/**',
    '!src/**/*.d.ts',
    '!src/assets/**',
    '!**/node_modules/**',
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },

  // Test environment
  testEnvironment: 'node',

  // Verbose output
  verbose: true,
};
