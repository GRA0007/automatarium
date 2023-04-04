import { useRef, useEffect, useState } from 'react'

import { dispatchCustomEvent } from '/src/util/events'
import { useProjectStore } from '/src/stores'
import { STATE_CIRCLE_RADIUS } from '/src/config/rendering'

import { circleStyles, stepGlowStyle, circleSelectedClass, textStyles } from './stateCircleStyle'

const FINAL_OUTLINE_OFFSET = 5

const StateCircle = ({ id, name, label, isFinal, cx, cy, selected, stepped, ...props }) => {
  const statePrefix = useProjectStore(s => s.project?.config?.statePrefix) ?? 'q'

  const displayName = name || `${statePrefix}${id}`

  const labelRef = useRef()
  const [labelBox, setLabelBox] = useState()

  useEffect(() => {
    const { x, y, width, height } = labelRef.current?.getBBox() ?? {}
    setLabelBox({ x, y: y - 3, width: width + 14, height: height + 6 })
  }, [labelRef.current, label])

  // TODO: use Callback
  const handleStateMouseUp = e =>
    dispatchCustomEvent('state:mouseup', {
      originalEvent: e,
      state: { id, name, cx, cy }
    })
  const handleStateMouseDown = e =>
    dispatchCustomEvent('state:mousedown', {
      originalEvent: e,
      state: { id, name, cx, cy }
    })

  return <g transform={`translate(${cx}, ${cy})`} onMouseDown={handleStateMouseDown} onMouseUp={handleStateMouseUp} {...props}>
    {/* Filled Circle */}
    <circle r={STATE_CIRCLE_RADIUS} style={{ ...circleStyles, ...(stepped ? stepGlowStyle : {}) }} className={(selected && circleSelectedClass) || undefined} />

    {/* Extra outline for final states */}
    {isFinal && <circle r={STATE_CIRCLE_RADIUS - FINAL_OUTLINE_OFFSET} style={circleStyles} className={(selected && circleSelectedClass) || undefined} />}

    {/* Name */}
    <text textAnchor="middle" alignmentBaseline="central" style={textStyles}>
      {displayName}
    </text>

    {/* State label */}
    {label && <g transform={`translate(0, ${STATE_CIRCLE_RADIUS})`}>
      <rect
        x={-(labelBox?.width ?? 0) / 2}
        y={labelBox?.y}
        width={labelBox?.width}
        height={labelBox?.height}
        style={circleStyles}
        className={(selected && circleSelectedClass) || undefined}
        ry="5" rx="5"
      />
      <text ref={labelRef} textAnchor="middle" alignmentBaseline="central" style={textStyles}>{label}</text>
    </g>}
  </g>
}

StateCircle.Ghost = ({ cx, cy }) =>
  <circle cx={cx} cy={cy} r={STATE_CIRCLE_RADIUS} style={{ ...circleStyles, opacity: 0.3, pointerEvents: 'none' }} />

export default StateCircle
