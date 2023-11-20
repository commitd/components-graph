import { componentsConfig } from '@committed/ds/config'

export default componentsConfig(
  {
    include: [
      './*.{js,jsx,ts,tsx}',
      '../../packages/react/src',
      '../../node_modules/@committed/ds/dist/panda.buildinfo.json',
    ],
    outdir: '../../node_modules/@committed/ds-ss',
  },
  {
    primary: 'blue',
    secondary: 'mint',
    neutral: 'slate',
    info: 'sky',
    warn: 'amber',
    error: 'tomato',
    success: 'grass',
  }
)
