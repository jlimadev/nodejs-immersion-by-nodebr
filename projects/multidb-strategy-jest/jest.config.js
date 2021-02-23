module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/coverage/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/coverage/'],
  testMatch: ['<rootDir>/src/**/*.spec.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/coverage/'],
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/coverage/'],
  timers: 'fake',
  clearMocks: true,
  resetMocks: false,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/jest.config.js',
    '!src/**/debug*.js',
    '!src/**/mongodbCommands.js',
    '!src/**/ContextStrategy.js',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: 'node',
};
