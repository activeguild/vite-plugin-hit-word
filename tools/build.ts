import { build } from 'esbuild'

build({
  entryPoints: ['./src/index.ts'],
  outdir: 'dist',
  bundle: true,
  minify: false,
  platform: 'node',
}).catch(() => process.exit(1))
