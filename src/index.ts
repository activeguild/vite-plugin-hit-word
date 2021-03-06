import { createFilter } from '@rollup/pluginutils'
import { promises as fsp } from 'fs'
import * as pc from 'picocolors'
import type { Colors } from 'picocolors/types'
import type { PluginOption } from 'vite'

export declare interface Options {
  include?: string | RegExp | Array<string | RegExp>
  exclude?: string | RegExp | Array<string | RegExp>
  word: Word<WordValue> | Array<Word<WordValue>>
}
type ReplacementFunc = (word: string | RegExp, fileText: string) => string
type WordValue = string | RegExp
type FontColor = keyof Pick<
  Colors,
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
>
type Word<T extends WordValue> = {
  value: T
} & Partial<{
  logFontColor: FontColor
  hasDeadlineDate: boolean
  thrownDeadlineExceeded: boolean
  deadlineExceededFonrColor: FontColor
  replacement: ReplacementFunc | string
}>

const resolveWordOption = (
  word: Word<WordValue> | Array<Word<WordValue>>
): Array<Word<WordValue>> => {
  if (Array.isArray(word)) {
    return word
  } else {
    return [word]
  }
}

export default function vitePluginHitWord(
  opts: Options = { word: { value: 'todo:' } }
): PluginOption {
  const filter = createFilter(opts.include, opts.exclude)
  const words = resolveWordOption(opts.word)
  const logs: string[] = []

  return {
    name: 'vite-plugin-hit-word',
    async load(id) {
      if (words.length > 0 && filter(id)) {
        const idWithoutPrefix = id.replace('.ts_file', '.ts').split('?')[0]

        const buffer = await fsp.readFile(idWithoutPrefix)
        let fileText = buffer.toString()
        const splittedFileText = fileText.split('\n')
        let index = 0

        while (index < splittedFileText.length) {
          const text = splittedFileText[index]

          for (const word of words) {
            if (!isMatched(text, word)) {
              continue
            }

            const formattedLog = `${idWithoutPrefix}(${index + 1}) : ${text}`
            if (IsDeadlineExceeded(text, word)) {
              const func = pc[word.deadlineExceededFonrColor || 'red']
              if (word.thrownDeadlineExceeded) {
                console.log(func(formattedLog))
                throw new Error('The set date has been exceeded.')
              } else {
                logs.push(func(formattedLog))
              }
            } else {
              logs.push(pc[word.logFontColor || 'yellow'](formattedLog))
            }
          }

          index++
        }

        for (const word of words) {
          if (!word.replacement) {
            continue
          }

          if (typeof word.replacement === 'function') {
            fileText = word.replacement(word.value, fileText)
          } else {
            fileText = fileText.replace(word.value, word.replacement)
          }
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

function isMatched(text: string, word: Word<string | RegExp>): boolean {
  if (typeof word.value === 'string') {
    return text.includes(word.value)
  } else {
    return word.value.test(text)
  }
}

function IsDeadlineExceeded(text: string, word: Word<WordValue>): boolean {
  if (!word.hasDeadlineDate) {
    return false
  }
  const matchedTexts = text.match(/(?<=[[({])[^\][]*(?=[\]})])/g)
  if (matchedTexts) {
    for (const matchedText of matchedTexts) {
      const date = new Date(matchedText)
      if (Date.now() >= date.getTime()) {
        return true
      }
    }
  }

  return false
}
