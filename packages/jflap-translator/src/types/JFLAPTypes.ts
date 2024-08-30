export interface JFLAPState {
  _attributes: {
    id: number
    name: string
  }
  label?: { _text: string }
  x: { _text: number }
  y: { _text: number }
  final?: object
  initial?: object
}

export interface BaseJFLAPTransition {
  from: { _text: number }
  to: { _text: number }
  read: { _text?: string }
}

export type JFLAPTransitionFSA = BaseJFLAPTransition

export interface JFLAPTransitionPDA extends BaseJFLAPTransition {
  push: { _text?: string }
  pop: { _text?: string }
}

export type JFLAPDirection = 'L' | 'R' | 'S'
export interface JFLAPTransitionTM extends BaseJFLAPTransition {
  write: { _text?: string }
  move: { _text?: JFLAPDirection }
}

export type JFLAPTransition = JFLAPTransitionFSA | JFLAPTransitionPDA | JFLAPTransitionTM

export interface JFLAPComment {
  text: { _text: string }
  x: { _text: number }
  y: { _text: number }
}
