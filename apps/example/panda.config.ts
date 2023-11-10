import { componentsConfig } from '@committed/ds'

export default componentsConfig(
  {
    include: ['./*.{js,jsx,ts,tsx}', '../../packages/react/src'],
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
