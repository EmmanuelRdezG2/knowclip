import { fromEvent, of, concat, from, defer } from 'rxjs'
import { takeUntil, mergeMap, tap, map, catchError } from 'rxjs/operators'
import { Readable } from 'stream'
import * as yauzl from 'yauzl'
import { getTableName, LexiconEntry } from '../../files/dictionaryFile'
import {
  getGermanSearchTokens,
  getGermanDifferingStems,
} from '../../utils/dictCc'
import { getTokenCombinations } from '../../utils/tokenCombinations'
import { getDexieDb } from '../dictionariesDatabase'

export async function parseDictCCZip(file: DictCCDictionary, filePath: string) {
  // create table for dictionary entry
  // for each term_bank_*.json file in archive
  // add to indexeddb
  let termBankMet = false
  const zipfile: yauzl.ZipFile = await new Promise((res, rej) => {
    yauzl.open(filePath, { lazyEntries: true }, function(err, zipfile) {
      if (err) return rej(err)
      if (!zipfile) return rej(new Error('problem reading zip file'))

      res(zipfile)
    })
  })

  const { entryCount } = zipfile

  let visitedEntries = 0

  const entriesObservable = fromEvent(zipfile, 'entry').pipe(
    takeUntil(fromEvent(zipfile, 'close')),
    mergeMap(_entry => {
      visitedEntries++

      const entry: yauzl.Entry = _entry as any
      if (!/\.txt/.test(entry.fileName)) {
        zipfile.readEntry()
        return of(visitedEntries / entryCount)
      }
      termBankMet = true
      console.log('match!')

      const entryReadStreamPromise: Promise<Readable> = new Promise(
        (res, rej) => {
          zipfile.openReadStream(entry as yauzl.Entry, (err, readStream) => {
            if (err) return rej(err)
            if (!readStream) return rej(new Error('problem streaming zip file'))

            res(readStream)
          })
        }
      )

      let entryBytesProcessed = 0
      const { uncompressedSize: entryTotalBytes } = entry
      return concat(
        from(entryReadStreamPromise).pipe(
          mergeMap(entryReadStream => {
            const context = {
              nextChunkStart: '',
              buffer: [] as LexiconEntry[],
            }

            const readEntryObservable = fromEvent(entryReadStream, 'data').pipe(
              takeUntil(fromEvent(entryReadStream, 'end')),
              tap(async _data => {
                const data: Buffer = _data as any

                entryBytesProcessed += data.length

                try {
                  importDictionaryEntries(context, file, data)
                } catch (err) {
                  throw err
                }
              }),
              map(() => {
                const entryFractionProcessed =
                  (entryBytesProcessed / entryTotalBytes) * (1 / entryCount)
                return (
                  entryFractionProcessed + (visitedEntries - 1) / entryCount
                )
              })
            )

            return concat(
              readEntryObservable,
              defer(() => {
                zipfile.readEntry()
                return of(visitedEntries / entryCount)
              })
            )
          })
        )
        // TODO: stream error event?\
      )
    })
  )

  const progressObservable = concat(
    entriesObservable,
    defer(() => {
      if (!termBankMet) throw new Error(`Invalid dictionary file.`)

      return from([100])
    })
  ).pipe(
    catchError(err => {
      zipfile.close()
      throw err
    })
  )

  zipfile.readEntry()

  return progressObservable
}

async function importDictionaryEntries(
  context: { nextChunkStart: string; buffer: (Omit<LexiconEntry, 'key'>)[] },
  file: DictCCDictionary,
  data: Buffer
) {
  const { nextChunkStart, buffer } = context
  // const entries: LexiconEntry[] = []
  const lines = (nextChunkStart + data.toString()).split(/[\n\r]+/)
  const lastLineIndex = lines.length - 1
  context.nextChunkStart = lines[lastLineIndex]
  for (let i = 0; i < lastLineIndex; i++) {
    const line = lines[i]
    // console.log(line, "!line.startsWith('#') && i !== lastLineIndex", !line.startsWith('#'), i !== lastLineIndex)
    if (line && !line.startsWith('#') && i !== lastLineIndex) {
      // (aufgeregt) auffliegen~~~~~to flush [fly away]~~~~~verb~~~~~[hunting] [zool.]
      // Rosenwaldsänger {m}~~~~~pink-headed warbler [Ergaticus versicolor]	noun	[orn.]
      const [head, meaning, pos, endTags] = line.split('\t')
      // strip affixes and bits inside curly braces
      const searchTokens = getGermanSearchTokens(head)
      if (!searchTokens.length) continue

      const searchStems = getGermanDifferingStems(head)
      const grammTags = [...head.matchAll(/\{.+?}/g)] || []

      if (searchTokens.length !== searchStems.length) {
        console.error('mismatch')
        console.log({ searchStems, searchTokens })
      }

      if (searchStems.length > 5) console.log(head, searchStems.join(' '))

      buffer.push({
        head,
        meanings: [meaning],
        tags: `${[
          ...(pos ? [pos] : []),
          ...(endTags ? endTags.split(/\s+/) : []),
          ...grammTags,
        ].join(' ')}`,
        variant: null,
        pronunciation: null,
        dictionaryKey: file.key,
        frequencyScore: null,
        // searchStems,
        // searchStemsSorted: toSortedX(searchStems),
        // searchTokens,
        searchTokensCount: searchTokens.length,
        tokenCombos:
          // should get chunks from all places, just doing the start for now
          getTokenCombinations(searchStems.slice(0, 5)).map(tokenCombo => {
            return [
              ...tokenCombo.sort(),
              searchStems.length.toString(16).padStart(2, '0'),
            ].join(' ')
          }),
      })
    }
  }
  // total += entries.length
  if (buffer.length >= 2000) {
    const oldBuffer = buffer
    context.buffer = []

    console.log('2000 more!')
    await getDexieDb()
      .table(getTableName(file.type))
      .bulkAdd(oldBuffer)
  }
}
