import {
  flatMap,
  mergeAll,
  concat,
  concatMap,
  map,
  endWith,
  catchError,
} from 'rxjs/operators'
import { ofType, combineEpics } from 'redux-observable'
import { of, from, defer, empty } from 'rxjs'
import { promises as fs } from 'fs'
import * as r from '../redux'
import * as A from '../types/ActionType'
import { getCsvText } from '../utils/prepareExport'
import { getApkgExportData } from '../utils/prepareExport'
import { processClip } from '../utils/ankiNote'
import { writeFile } from 'fs-extra'
import { join, basename } from 'path'

const exportCsv: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, ExportCsv>(A.EXPORT_CSV),
    flatMap(
      ({
        mediaFileIdsToClipIds,
        csvFilePath,
        mediaFolderLocation,
        rememberLocation,
      }) => {
        const clozeCsvFilePath = csvFilePath.replace(/\.csv$/, '__CLOZE.csv')

        const currentProject = r.getCurrentProject(state$.value)
        if (!currentProject)
          return of(r.simpleMessageSnackbar('Could not find project'))

        const exportData = getApkgExportData(
          state$.value,
          currentProject,
          mediaFileIdsToClipIds
        )
        if ('missingMediaFiles' in exportData) {
          return from(
            [...exportData.missingMediaFiles].map(file =>
              r.locateFileRequest(
                file,
                `You can't make clips from this file until you've located it in the filesystem:\n${
                  file.name
                }`
              )
            )
          )
        }

        const { csvText, clozeCsvText } = getCsvText(exportData)

        const processClipsObservables = exportData.clips.map(
          (clipSpecs: ClipSpecs, i) =>
            defer(async () => {
              const clipDataResult = await processClip(
                clipSpecs,
                mediaFolderLocation
              )
              if (clipDataResult.errors)
                throw new Error(clipDataResult.errors.join('; '))

              const { soundData, imageData } = clipDataResult.value

              await writeFile(soundData.filePath, await soundData.data())
              if (imageData)
                writeFile(
                  join(mediaFolderLocation, basename(imageData.filePath)),
                  await imageData.data()
                )

              return r.setProgress({
                percentage: (i + 1 / exportData.clips.length) * 100,
                message: `${i + 1} clips out of ${
                  exportData.clips.length
                } processed`,
              })
            })
        )

        return of(
          r.setProgress({
            percentage: 0,
            message: 'Processing clips...',
          })
        ).pipe(
          concat(
            rememberLocation &&
              mediaFolderLocation !== r.getMediaFolderLocation(state$.value)
              ? of(r.setMediaFolderLocation(mediaFolderLocation))
              : empty()
          ),
          concat(from(processClipsObservables).pipe(mergeAll(20))),
          concat(
            of(
              r.setProgress({
                percentage: 100,
                message: `Almost done! Saving csv ${
                  clozeCsvText ? 'files' : 'file'
                }...`,
              })
            ).pipe(
              concatMap(() => {
                return defer(async () => {
                  await writeFile(csvFilePath, csvText, 'utf8')
                  if (clozeCsvText) {
                    await writeFile(clozeCsvFilePath, clozeCsvText, 'utf8')
                  }
                }).pipe(
                  map(() =>
                    r.exportApkgSuccess(
                      'Flashcards made in ' +
                        [csvFilePath, clozeCsvText && clozeCsvFilePath]
                          .filter(s => s)
                          .join(' and ')
                    )
                  ),
                  endWith(r.setProgress(null))
                )
              })
            )
          )
        )
      }
    ),
    catchError(err => {
      console.error(err)
      return from([
        r.exportApkgFailure(err.message || err.toString()),
        r.setProgress(null),
      ])
    })
  )

export default combineEpics(exportCsv)
