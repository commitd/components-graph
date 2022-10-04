module.exports = {
  projects: [
    {
      displayName: '@committed/graph',
      rootDir: './packages/graph',
      preset: '@committed/config/jest/node',
    },
    {
      displayName: '@committed/graph-json',
      rootDir: './packages/graph-json',
      preset: '@committed/config/jest/node',
    },
    {
      displayName: '@committed/graph-red',
      rootDir: './packages/graph-rdf',
      preset: '@committed/config/jest/node',
    },
    {
      displayName: '@committed/components-graph-react',
      rootDir: './packages/react',
      preset: '@committed/config/jest/jsdom',
    },
  ],
  collectCoverage: true,
  testResultsProcessor: 'jest-sonar-reporter',
}
