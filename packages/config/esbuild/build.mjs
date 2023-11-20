import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

const entryFile = 'src/index.ts'
const outFolder = 'dist'

const shared = {
  bundle: false,
  entryPoints: [entryFile],
  logLevel: 'info',
  minify: false,
  sourcemap: false,
  plugins: [nodeExternalsPlugin()],
}

build({
  ...shared,
  format: 'esm',
  target: ['es2022'],
  outfile: `${outFolder}/index.mjs`,
})

// build({
//   ...shared,
//   format: 'cjs',
//   target: ['node16'],
//   outfile: `${outFolder}/index.cjs.js`,
// })
