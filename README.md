<h1 align="center">vite-plugin-hit-word ⚡ Welcome 😀</h1>

<p align="left">
  <a href="https://github.com/actions/setup-node"><img alt="GitHub Actions status" src="https://github.com/activeguild/vite-plugin-hit-word/workflows/automatic%20release/badge.svg" style="max-width:100%;"></a>
</p>

# vite-plugin-hit-word

Lists files containing the specified word(s).

## Install

```bash
npm i -D vite-plugin-hit-word
```

## Add it to vite.config.ts

```ts
import { defineConfig } from 'vite'
import hitWord from 'vite-plugin-hit-word'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [hitWord({ word: 'todo:' })],
})
```

## Principles of conduct

Please see [the principles of conduct](https://github.com/activeguild/vite-plugin-hit-word/blob/master/.github/CONTRIBUTING.md) when building a site.

## License

This library is licensed under the [MIT license](https://github.com/activeguild/vite-plugin-hit-word/blob/master/LICENSE).
