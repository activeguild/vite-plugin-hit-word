import { createFilter } from '@rollup/pluginutils'
import * as fs from 'fs'
import * as pc from 'picocolors'
import type { PluginOption } from 'vite'

export declare interface Options {
  include?: string | RegExp | Array<string | RegExp>
  exclude?: string | RegExp | Array<string | RegExp>
  word: Word<string> | Word<RegExp> | Array<Word<string | RegExp>>
}

type Word<T> = {
  value: T
  hasLimitDate?: boolean
}

const resolveWord = (
  word?: Word<string> | Word<RegExp> | Array<Word<string | RegExp>>
): Array<Word<string | RegExp>> => {
  if (!word) {
    return []
  } else if (Array.isArray(word)) {
    return word
  } else {
    return [word]
  }
}

export default function vitePluginHitWord(
  opts: Options = { word: { value: 'todo' } }
): PluginOption {
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
        let index = 0

        while (index < splittedFileText.length) {
          const text = splittedFileText[index]

          for (const _word of word) {
            let matched = false
            if (typeof _word.value === 'string') {
              matched = text.includes(_word.value)
            } else {
              matched = _word.value.test(text)
            }

            if (matched) {
              let limited = false
              if (_word.hasLimitDate) {
                const matchedTexts = text.match(/(?<=[[({])[^\][]*(?=[\]})])/g)
                if (matchedTexts) {
                  for (const matchedText of matchedTexts) {
                    const date = new Date(matchedText)
                    if (Date.now() >= date.getTime()) {
                      limited = true
                      break
                    }
                  }
                }
              }

              const formattedLog = `${idWithoutUsed}(${index + 1}) :>> ${text}`
              if (limited) {
                logs.push(pc.red(formattedLog))
              } else {
                logs.push(pc.yellow(formattedLog))
              }
            }
          }

          index++
        }

        return fileText
      }
    },
    buildEnd() {
      if (logs.length > 0) {
        console.log('\n')
        for (const log of logs) {
          console.log(log)
        }
      }
    },
  }
}
