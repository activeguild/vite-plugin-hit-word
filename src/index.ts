import { createFilter } from '@rollup/pluginutils'
import * as fs from 'fs'
import * as pc from 'picocolors'
import type { PluginOption } from 'vite'

export declare interface Options {
  include?: string | RegExp | Array<string | RegExp>
  exclude?: string | RegExp | Array<string | RegExp>
  word?: string | RegExp | Array<string | RegExp>
}

const resolveWord = (word: Options['word']): Array<string | RegExp> => {
  if (!word) {
    return []
  } else if (typeof word === 'string' || word instanceof RegExp) {
    return [word]
  }
  return word
}

export default function vitePluginHitWord(opts: Options = {}): PluginOption {
  const filter = createFilter(opts.include, opts.exclude)
  const word = resolveWord(opts.word)
  const logs: string[] = []

  return {
    name: 'vite-plugin-hit-word',
    load(id) {
      if (word.length > 0 && filter(id)) {
        const idWithoutUsed = id
          .replace('?used', '')
          .replace('?worker', '')
          .replace('.ts_file', '.ts')

        const buffer = fs.readFileSync(idWithoutUsed)
        const fileText = buffer.toString()
        const splittedFileText = fileText.split('\n')
        const index = splittedFileText.findIndex((value) => {
          let matched = false
          for (const _word of word) {
            if (typeof _word === 'string') {
              matched = value.includes(_word)
            } else {
              matched = _word.test(value)
            }

            if (matched) return matched
          }

          return matched
        })

        if (index > -1) {
          const formattedLog = `${idWithoutUsed}(${index + 1}) :>> ${
            splittedFileText[index]
          }`

          logs.push(formattedLog)
        }

        return fileText
      }
    },
    buildEnd() {
      if (logs.length > 0) {
        for (const log of logs) {
          console.log(pc.yellow(log))
        }
      }
    },
  }
}
