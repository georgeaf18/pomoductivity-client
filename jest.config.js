module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    // Exempt environment files
    '!src/environments/**',
    // Exempt API services (require backend mocking)
    '!src/app/core/services/*-api.service.ts',
    // Exempt simple configuration files
    '!src/app/app.config.ts',
    '!src/app/app.routes.ts',
    // Exempt simple state files
    '!src/app/core/state/*.state.ts',
    // Exempt facades (thin wrappers)
    '!src/app/core/services/*.facade.ts',
    // Exempt WebSocket service (requires backend)
    '!src/app/core/services/websocket.service.ts',
    // Exempt feature components (require complex integration testing)
    '!src/app/features/**/*.component.ts',
    // Exempt simple presentational components
    '!src/app/shared/components/button/*.ts',
    '!src/app/shared/components/pill/*.ts',
    '!src/app/shared/components/progress-circle/*.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 65,
    },
  },
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@shared/(.*)': '<rootDir>/src/app/shared/$1',
    '@features/(.*)': '<rootDir>/src/app/features/$1',
    '@environments/(.*)': '<rootDir>/src/environments/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
