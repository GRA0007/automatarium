import { css } from 'goober'

export const circleStyles = {
  fill: 'var(--state-bg)',
  stroke: 'var(--stroke)',
}

export const circleSelectedClass = css`
  fill: var(--state-bg-selected) !important;
  stroke: var(--primary) !important;
  stroke-width: 2.5px !important;
`

export const textStyles = {
  userSelect: 'none',
  fill: 'var(--stroke)',
}
