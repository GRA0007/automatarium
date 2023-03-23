import { useContext } from 'react'
import { useProjectStore } from '../../stores'
import { MarkerContext } from '/src/providers'
import { STATE_CIRCLE_RADIUS, TRANSITION_SEPERATION, TEXT_PATH_OFFSET, REFLEXIVE_Y_OFFSET, REFLEXIVE_X_OFFSET } from '/src/config/rendering'
import { movePointTowards, lerpPoints, size } from '/src/util/points'
import { dispatchCustomEvent } from '/src/util/events'
import { useSelectionStore } from '/src/stores'

import { pathStyles, pathSelectedClass } from './transitionSetStyle'

// const projectType = useProjectStore(s => s.project.config.type)

const TransitionSet = ({ transitions }) => {
  const projectType = useProjectStore(s => s.project.config.type)

  return <>
    { transitions.map(({ id, from, to, read, write, direction, pop, push }, i) => (
        <Transition
        i={i}
        transitions={transitions}
        text={projectType === 'TM'
          ? ((read || 'λ') + ',' + (write || 'λ') + ';' + (direction || 'R'))
          : projectType === 'PDA'
            ? ((read || 'λ') + ',' +
                (pop || 'λ') + ';' +
                (push || 'λ'))
            : read}
        from={from}
        to={to}
        id={id}
        key={id}
        />)
    )}
    </>
}

const Transition = ({
  id,
  i,
  transitions = [],
  count = transitions.length,
  from,
  to,
  text,
  fullWidth = false,
  suppressEvents = false
}) => {
  const { standardArrowHead, selectedArrowHead } = useContext(MarkerContext)
  const selectedTransitions = useSelectionStore(s => s.selectedTransitions)
  const selected = selectedTransitions?.includes(id)
  const setSelected = transitions.some(t => selectedTransitions.includes(t.id))
  const projectStore = useProjectStore(s => s.project.config.type)
  // Determine how much to bend this path
  const evenCount = count % 2 === 0
  const middleValue = evenCount ? count / 2 + 0.5 : Math.floor(count / 2)
  const bendValue = TRANSITION_SEPERATION * (count > 1 ? middleValue - (i + (evenCount ? 1 : 0)) : 0) / 2

  // Calculate path
  const isReflexive = from.x === to.x && from.y === to.y
  const { pathData, textPathData, control } = calculateTransitionPath({ from, to, bendValue, fullWidth, i })

  // Generate a unique id for this path
  // -- used to place the text on the same path
  const pathID = `${i}${from.x}${from.y}${to.x}${to.y}`

  // TODO: useCallback
  const handleTransitionMouseUp = e =>
    dispatchCustomEvent('transition:mouseup', {
      originalEvent: e,
      transition: { id, from, to, text }
    })
  const handleTransitionMouseDown = e =>
    dispatchCustomEvent('transition:mousedown', {
      originalEvent: e,
      transition: { id, from, to, text }
    })

  const handleTransitionDoubleClick = e =>
    dispatchCustomEvent('transition:mousedoubleclick', {
      originalEvent: e,
      transition: { id, from, to, text }
    }, dispatchCustomEvent('editTransition', { id }))

  // Calculate text offset (increased for additional reflexive transitions)
  const textOffset = (isReflexive && i > 0) ? TEXT_PATH_OFFSET + i * 20 : TEXT_PATH_OFFSET

  return <g>
    {/* The edge itself */}
    {!(isReflexive && i > 0) && <path
      id={pathID}
      d={pathData}
      key={pathID}
      markerEnd={`url(#${selected || (isReflexive && setSelected) ? selectedArrowHead : standardArrowHead})`}
      style={pathStyles}
      className={((selected || (isReflexive && setSelected)) && pathSelectedClass) || undefined}
    />}

    {/* Invisible path used to place text */}
    <path id={`${pathID}-text`} d={textPathData} key={`${pathID}-text`} stroke='none' fill='none' />

    {/* Thicker invisible path used to select the transition */}
    {!suppressEvents && <path
      id={pathID}
      d={pathData}
      key={`${pathID}-selection`}
      stroke='transparent'
      fill='none'
      strokeWidth={20}
      onMouseDown={handleTransitionMouseDown}
      onMouseUp={handleTransitionMouseUp}
      onDoubleClick={handleTransitionDoubleClick}
    />}

    {/* The label for FSAs - i.e the accepted symbols */}
    {(projectStore === 'FSA' || projectStore === 'TM') &&
      <text
        onMouseDown={!suppressEvents ? handleTransitionMouseDown : undefined}
        onMouseUp={!suppressEvents ? handleTransitionMouseUp : undefined}
        fill={selected ? 'var(--primary)' : 'var(--stroke)'}
        style={{ userSelect: 'none' }}
        dy={`-${textOffset}`}
        textAnchor="middle"
        alignmentBaseline="central"
        {...isReflexive && {
          x: control.x,
          y: control.y + REFLEXIVE_Y_OFFSET / 3
        }}
      >
        {isReflexive
          ? (text === '' ? 'λ' : text)
          : (
          <textPath startOffset="50%" textAnchor="middle" xlinkHref={`#${pathID}-text`}>
            {text === '' ? 'λ' : text}
          </textPath>
            )}
      </text>
    }

    {/* The label for PDAs - i.e the accepted symbols */}
    {(projectStore === 'PDA') &&
      <text
        onMouseDown={!suppressEvents ? handleTransitionMouseDown : undefined}
        onMouseUp={!suppressEvents ? handleTransitionMouseUp : undefined}
        fill={selected ? 'var(--primary)' : 'var(--stroke)'}
        style={{ userSelect: 'none' }}
        dy={`-${textOffset}`}
        textAnchor="middle"
        alignmentBaseline="central"
        {...isReflexive && {
          x: control.x,
          y: control.y + REFLEXIVE_Y_OFFSET / 3
        }}
      >
        {isReflexive
          ? (text === '' ? 'λ,λ;λ' : text)
          : (
          <textPath startOffset="50%" textAnchor="middle" xlinkHref={`#${pathID}-text`}>
            {text === '' ? 'λ,λ;λ' : text}
          </textPath>
            )}
      </text>
    }
  </g>
}

const calculateTransitionPath = ({ from, to, bendValue, fullWidth }) => {
  // Is this path reflexive
  const isReflexive = from.x === to.x && from.y === to.y

  // Determine control position
  // -- this is determined by moving along the normal to the difference between the states
  // -- with the distance moved controled by the `bend` value
  const [left, right] = from.x < to.x ? [from, to] : [to, from]
  const center = lerpPoints(left, right, 0.5)
  const tangent = { x: left.x - right.x, y: left.y - right.y }
  const a = Math.PI / 2
  const orth = { x: tangent.x * Math.cos(a) - tangent.y * Math.sin(a), y: tangent.x * Math.sin(a) + tangent.y * Math.cos(a) }
  const normal = size(orth) > 0 ? { x: orth.x / size(orth), y: orth.y / size(orth) } : { x: 0, y: 0 }
  const control = isReflexive
    ? { x: left.x, y: left.y - REFLEXIVE_Y_OFFSET }
    : { x: center.x + bendValue * normal.x, y: center.y + bendValue * normal.y }

  // Translate control points (Used for reflexive paths)
  const translatedControl1 = !isReflexive ? control : { ...control, x: control.x - REFLEXIVE_X_OFFSET }
  const translatedControl2 = !isReflexive ? control : { ...control, x: control.x + REFLEXIVE_X_OFFSET }

  // We connect the edge to the closest point on each circle from the control point
  // (If fullWidth is set we move it just far enough to prevent accidental click events)
  const edge1 = fullWidth
    ? movePointTowards(from, translatedControl1, 2)
    : movePointTowards(from, translatedControl1, STATE_CIRCLE_RADIUS)
  const edge2 = fullWidth
    ? movePointTowards(to, translatedControl2, 2)
    : movePointTowards(to, translatedControl2, STATE_CIRCLE_RADIUS)

  // Generate the path data
  const pathData = `M${edge1.x}, ${edge1.y} Q${control.x}, ${control.y} ${edge2.x}, ${edge2.y}`
  const pathReversed = `M${edge2.x}, ${edge2.y} Q${control.x}, ${control.y} ${edge1.x}, ${edge1.y}`

  // Calculate the angle of the line
  const angle = Math.atan2(edge2.y - edge1.y, edge2.x - edge1.x) * 180 / Math.PI

  return {
    pathData,
    textPathData: (angle > 90 || angle <= -90) ? pathReversed : pathData,
    control
  }
}

TransitionSet.Transition = Transition

export default TransitionSet
