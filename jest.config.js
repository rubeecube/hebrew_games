module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/unit/**/*.test.js'],
  collectCoverageFrom: [
    'tests/helpers/**/*.js',
    '!tests/helpers/**/*.spec.js'
  ],
  coverageDirectory: 'test-results/coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  verbose: true,
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.js'],
};




