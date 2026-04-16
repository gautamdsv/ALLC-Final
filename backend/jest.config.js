export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 10000,
  setupFiles: ['<rootDir>/jest.setup.js'],
};
