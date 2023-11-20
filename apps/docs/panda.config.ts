import { componentsConfig } from '@committed/ds/config'

export default componentsConfig(
  {
    include: ['./src/**/*.{js,jsx,ts,tsx}', '../../packages/react/src'],
    exclude: ['../../node_modules/@committed/ds-ss/index.mjs'],
    outdir: '../../node_modules/@committed/ds-ss'
  },
  {
    primary: 'blue',
    secondary: 'mint',
    neutral: 'slate',
    info: 'sky',
    warn: 'amber',
    error: 'tomato',
    success: 'grass',
  },
)
