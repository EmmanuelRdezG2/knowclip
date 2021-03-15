import { useCallback, MutableRefObject, Dispatch } from 'react'
import r from '../redux'
import {
  msToSeconds,
  overlapsSignificantly,
  pixelsToMs,
  secondsToMs,
  WaveformSelectionExpanded,
} from '../selectors'
import { WaveformAction } from './useWaveformState'
import { elementWidth } from '../utils/media'

export function useWaveformMediaTimeUpdate(
  svgRef: any,
  dispatch: Dispatch<WaveformAction>,
  waveformItems: WaveformSelectionExpanded[],
  state: ViewState
) {
  return useCallback(
    (
      media: HTMLVideoElement | HTMLAudioElement,
      seeking: MutableRefObject<boolean>,
      looping: boolean
    ) => {
      const svg = svgRef.current
      if (!svg) return console.error('Svg disappeared')

      const newMilliseconds = secondsToMs(media.currentTime)
      const currentSelection = state.selection
      // tODO: optimize
      const selectionItem = waveformItems.find(
        (item) => item.index === currentSelection?.index
      )?.item
      const expandedSelection: WaveformSelectionExpanded | null =
        currentSelection && selectionItem
          ? ({
              type: currentSelection.type,
              index: currentSelection.index,
              item: selectionItem,
            } as WaveformSelectionExpanded)
          : null

      const newSelectionCandidate = r.getNewWaveformSelectionAtFromSubset(
        expandedSelection,
        waveformItems,
        newMilliseconds
      )

      const newSelection = isValidNewSelection(
        expandedSelection,
        newSelectionCandidate
      )
        ? newSelectionCandidate
        : null
      const wasSeeking = seeking.current
      seeking.current = false

      const loopImminent =
        !wasSeeking &&
        looping &&
        !media.paused &&
        currentSelection &&
        selectionItem &&
        newMilliseconds >= selectionItem.end
      if (loopImminent && currentSelection && selectionItem) {
        media.currentTime = msToSeconds(selectionItem.start)
        const action: WaveformAction = {
          type: 'NAVIGATE_TO_TIME',
          ms: selectionItem.start,
          viewBoxStartMs: state.viewBoxStartMs,
        }
        return dispatch(action)
      }

      dispatch({
        type: 'NAVIGATE_TO_TIME',
        ms: newMilliseconds,
        selection:
          !wasSeeking && !newSelection ? currentSelection : newSelection,
        viewBoxStartMs: viewBoxStartMsOnTimeUpdate(
          state,
          newMilliseconds,
          elementWidth(svg),
          newSelection,
          wasSeeking
        ),
      })
    },
    [dispatch, svgRef, state, waveformItems]
  )
}

function isValidNewSelection(
  currentSelection: WaveformSelectionExpanded | null,
  newSelectionCandidate: WaveformSelectionExpanded | null
) {
  if (
    currentSelection &&
    currentSelection.type === 'Clip' &&
    newSelectionCandidate &&
    newSelectionCandidate.type === 'Preview'
  ) {
    return overlapsSignificantly(
      newSelectionCandidate.item,
      currentSelection.item.start,
      currentSelection.item.end
    )
      ? false
      : true
  }

  return true
}

function viewBoxStartMsOnTimeUpdate(
  viewState: ViewState,
  newlySetMs: number,
  svgWidth: number,
  newSelection: ReturnType<typeof r.getNewWaveformSelectionAt>,
  seeking: boolean
): number {
  const visibleTimeSpan = pixelsToMs(svgWidth, viewState.pixelsPerSecond)
  const buffer = Math.round(visibleTimeSpan * 0.1)

  const { viewBoxStartMs, durationSeconds } = viewState
  const durationMs = secondsToMs(durationSeconds)

  const currentRightEdge = viewBoxStartMs + visibleTimeSpan

  const leftShiftRequired = newlySetMs < viewBoxStartMs
  if (leftShiftRequired) {
    return Math.max(0, newlySetMs - buffer)
  }

  const rightShiftRequired = newlySetMs >= currentRightEdge
  if (rightShiftRequired) {
    return bound(newSelection ? newSelection.item.end + buffer : newlySetMs, [
      0,
      durationMs - visibleTimeSpan,
    ])
  }

  if (seeking && newSelection) {
    if (newSelection.item.end + buffer >= currentRightEdge)
      return bound(newSelection.item.end + buffer - visibleTimeSpan, [
        0,
        durationMs - visibleTimeSpan,
      ])

    if (newSelection.item.start - buffer <= viewBoxStartMs)
      return Math.max(0, newSelection.item.start - buffer)
  }

  return viewState.viewBoxStartMs
}

function bound(number: number, [min, max]: [number, number]) {
  return Math.max(min, Math.min(max, number))
}
