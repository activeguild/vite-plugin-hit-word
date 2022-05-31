<h1 align="center">vite-plugin-hit-word ⚡ Welcome 😀</h1>

<p align="left">
  <a href="https://github.com/actions/setup-node"><img alt="GitHub Actions status" src="https://github.com/activeguild/vite-plugin-hit-word/workflows/automatic%20release/badge.svg" style="max-width:100%;"></a>
</p>

# vite-plugin-hit-word

Lists files containing the specified word(s).
Say goodbye to the disappointment of todo on the code.

## Motivation

People often forget that there is a `todo` left on the code. By including `todo` checks in your builds, you provide an opportunity to ensure that `todo` is noticed.
Of course, it is also possible to search for words other than `todo`.
If a line matching the word has a date set, it is compared to the current date and highlighted.

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
  plugins: [
    hitWord({
      include: ['src/*'],
      exclude: ['node_modules'],
      word: { value: ['todo'], hasLimitDate: true },
    }),
  ],
})
```

## Options

If `hasLimitDate` is set, compares the current date to the date set on the line where the matched word exists. If the current date is newer, the text on the console is printed in red.

| Parameter         | Type                                        | Description                                       |
| ----------------- | ------------------------------------------- | ------------------------------------------------- |
| includes          | string \| RegExp \| Array<string \| RegExp> | Set the target path.                              |
| exclude           | string \| RegExp \| Array<string \| RegExp> | Set the paths you want to exclude.                |
| word.value        | string \| RegExp \| Array<string \| RegExp> | Set the words you want to search for on the code. |
| word.hasLimitDate | boolean                                     | Check with the current date.(default false)       |

## Principles of conduct

Please see [the principles of conduct](https://github.com/activeguild/vite-plugin-hit-word/blob/master/.github/CONTRIBUTING.md) when building a site.

## License

This library is licensed under the [MIT license](https://github.com/activeguild/vite-plugin-hit-word/blob/master/LICENSE).
