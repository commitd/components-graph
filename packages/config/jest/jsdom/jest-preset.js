module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  moduleNameMapper: {
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    uuid: require.resolve('uuid'),
  },

  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  coverageReporters: [
    'lcov',
    [
      'text',
      {
        skipFull: true,
      },
    ],
  ],
  // so the coverage report includes all files, including untested files
  collectCoverageFrom: [
    '<root_dir>/src/**/*.{ts,tsx}',
    '!<root_dir>/src/types/**/*',
  ],
  coveragePathIgnorePatterns: [
    '<root_dir>/src/typings.d.ts',
    '<root_dir>test/*',
    '.*/index.ts',
    '.*.test.ts',
    '.*.test.tsx',
    '.*.stories.tsx',
  ],
}
