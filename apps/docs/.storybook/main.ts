import type { StorybookConfig } from '@storybook/react-vite'
import { dirname, join } from 'path'


const config: StorybookConfig =  {
  stories: ['../src/Test.stories.tsx'],
  // stories: ['../src/CustomRenderer.stories.tsx'],
  // stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-mdx-gfm'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  docs: {
    autodocs: true,
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen',
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

export default config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
