module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',
    '<rootDir>/node_modules',
    '<rootDir>/dist',
  ],
  preset: 'ts-jest',

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
