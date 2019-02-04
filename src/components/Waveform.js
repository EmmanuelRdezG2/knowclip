import React, { Component } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import * as r from '../redux'
import { WAVEFORM_HEIGHT } from '../selectors'

const { SELECTION_BORDER_WIDTH } = r

// should actually just store peaks in redux, not path
// then getSvgPath will be a memoized? selector,
//   taking peaks plus "camera" and "zoom"

export function getSvgPath(peaks, stepLength) {
  const totalPeaks = peaks.length
  let d = ''
  for (let peakNumber = 0; peakNumber < totalPeaks; peakNumber++) {
    if (peakNumber % 2 === 0) {
      d += ` M${~~(peakNumber / 2) * stepLength}, ${peaks[peakNumber] *
        WAVEFORM_HEIGHT +
        WAVEFORM_HEIGHT}`
    } else {
      d += ` L${~~(peakNumber / 2) * stepLength}, ${peaks[peakNumber] *
        WAVEFORM_HEIGHT +
        WAVEFORM_HEIGHT}`
    }
  }
  return d
}

const Cursor = ({ x, y }) => (
  // null
  <line
    stroke="black"
    x1={x}
    y1="-1"
    x2={x}
    y2="100"
    shapeRendering="crispEdges"
  />
)

const getSelectionPath = (startRaw, endRaw, stepsPerSecond) => {
  const start = startRaw
  const end = endRaw
  return `M${start} 0 L${end} 0 L${end} 100 L${start} 100 L${start} 0`
}

const Selection = ({
  id,
  start,
  end,
  stepsPerSecond,
  isHighlighted,
  flashcard,
}) => {
  return (
    <g id={id}>
      <path
        className={cn('waveform-selection', { isHighlighted })}
        d={getSelectionPath(start, end, stepsPerSecond)}
      />
      {/*<text x={start} y={90} width={end - start}>{Object.values(flashcard.fields)[0]}</text>*/}
      <rect
        className="waveform-selection-border"
        x={start}
        y="0"
        width={SELECTION_BORDER_WIDTH}
        height="100"
      />
      <rect
        className="waveform-selection-border"
        x={end - SELECTION_BORDER_WIDTH}
        y="0"
        width={SELECTION_BORDER_WIDTH}
        height="100"
      />
    </g>
  )
  // <path className="waveform-selection-border" d={`M${start} 0 L${leftBorderInnerEdge} 0 L`} />
}

const PendingSelection = ({ start, end, stepsPerSecond }) => (
  <path
    className="waveform-pending-selection"
    d={getSelectionPath(start, end, stepsPerSecond)}
  />
)

const PendingStretch = ({ start, end, stepsPerSecond }) => (
  <path
    className="waveform-pending-stretch"
    d={getSelectionPath(start, end, stepsPerSecond)}
  />
)

const getViewBox = xMin => `${xMin} 0 3000 100`

class Waveform extends Component {
  render() {
    const {
      peaks,
      viewBox,
      cursor,
      svgRef,
      selections,
      pendingSelection,
      pendingStretch,
      stepsPerSecond,
      stepLength,
      highlightedSelectionId,
      show,
    } = this.props
    return (
      <svg
        style={show ? {} : { display: 'none' }}
        id="waveform-svg"
        ref={svgRef}
        viewBox={getViewBox(viewBox.xMin)}
        preserveAspectRatio="xMinYMin slice"
        className="waveform-svg"
        width="100%"
        height="100"
      >
        <g className="waveform-g">
          <path
            className="waveform-path"
            d={getSvgPath(peaks, stepLength)}
            shapeRendering="crispEdges"
          />
        </g>
        <Cursor {...cursor} />
        <g className="waveform-selections">
          {selections.map(selection => (
            <Selection
              {...selection}
              stepsPerSecond={stepsPerSecond}
              isHighlighted={selection.id === highlightedSelectionId}
            />
          ))}
        </g>
        {pendingSelection && (
          <PendingSelection
            {...pendingSelection}
            stepsPerSecond={stepsPerSecond}
          />
        )}
        {pendingStretch && (
          <PendingStretch {...pendingStretch} stepsPerSecond={stepsPerSecond} />
        )}
      </svg>
    )
  }
}

const mapStateToProps = state => ({
  ...r.getWaveform(state),
})

export default connect(
  mapStateToProps,
  { highlightSelection: r.highlightSelection }
)(Waveform)
