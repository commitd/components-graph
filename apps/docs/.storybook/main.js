
module.exports =  {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    // '@storybook/addon-links',
    // '@storybook/addon-interactions',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
        configureJSX: true,
      },
    },
    'storybook-dark-mode',
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  framework: '@storybook/react',
  core: {
    builder: 'webpack4',
  },
  features: {
    postcss: false,
  },

  webpackFinal: async (config, { configType }) => {
    config.resolve?.extensions?.push('*', '.mjs', '.js', '.json')
    
    if(config.module){
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      })
    }
     return config;
  },

  previewHead: (head) => (`
  ${head}
  <link rel="icon" type="image/png" href="https://committed.io/favicon-32x32.png" sizes="32x32" />
  `),
  managerHead: (head) => (`
  ${head}
  <link rel="icon" type="image/png" href="https://committed.io/favicon-32x32.png" sizes="32x32" />
  `),

}

