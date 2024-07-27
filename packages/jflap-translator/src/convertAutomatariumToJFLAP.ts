import { json2xml } from 'xml-js'

import { expandReadSymbols } from '@automatarium/simulation'

import {
  JFLAPState,
  JFLAPTransition,
  JFLAPComment,
  BaseJFLAPTransition
} from './types/JFLAPTypes'
import {
  ProjectType,
  Project,
  PDAAutomataTransition, TMAutomataTransition,
  AutomataState,
  AutomataTransition,
  ProjectComment
} from 'frontend/src/types/ProjectTypes'

const PROJECT_TYPE_MAP: Record<ProjectType, string> = {
  'FSA': 'fa',
  'PDA': 'pda',
  'TM': 'turing'
}

const mapStates = (states: AutomataState[], initialStateId: number, statePrefix: string): JFLAPState[] => states.map((state) => ({
  _attributes: {
    id: state.id,
    name: state.name ?? `${statePrefix}${state.id}`
  },
  label: { _text: state.label },
  x: { _text: state.x },
  y: { _text: state.y },
  ...(state.isFinal ? { final: {} } : {}),
  ...(state.id === initialStateId ? { initial: {} } : {})
}))


const mapTransitions = (transitions: AutomataTransition[], projectType: ProjectType): JFLAPTransition[] => {
  // Sanity check for project type
  if (!Object.keys(PROJECT_TYPE_MAP).includes(projectType)) {
    throw new Error(`Unsupported Automatarium project type "${projectType}"!`)
  }

  return transitions.flatMap((transition) => {
    if (transition.read === '') {
      return [{
        from: { _text: transition.from },
        to: { _text: transition.to },
        read: {}
      }]
    }

    // Automatarium stores transitions like [a-z] in a single transition, but it is best to
    // map these individually to a corresponding JFLAP transition
    const readSymbols = expandReadSymbols(transition.read).split('')
    return readSymbols.map((readSymbol) => {
      const baseTransition: BaseJFLAPTransition = {
        from: { _text: transition.from },
        to: { _text: transition.to },
        read: readSymbol ? { _text: readSymbol } : {}
      }

      switch (projectType) {
        // No extra properties needed for FSA
        case "FSA": {
          return baseTransition
        }

        // Add pop and push properties to transition
        case "PDA": {
          const pdaTransition = transition as PDAAutomataTransition
          return {
            ...baseTransition,
            push: pdaTransition.push ? { _text: pdaTransition.push } : {},
            pop: pdaTransition.pop ? { _text: pdaTransition.pop } : {}
          }
        }

        // Add write and move properties to transition
        case "TM": {
          const tmTransition = transition as TMAutomataTransition
          return {
            ...baseTransition,
            write: tmTransition.write ? { _text: tmTransition.write } : {},
            move: tmTransition.direction ? { _text: tmTransition.direction } : {}
          }
        }
      }
    })
  })
}

const mapComments = (comments: ProjectComment[]): JFLAPComment[] => comments.map((comment) => ({
  text: { _text: comment.text },
  x: { _text: comment.x },
  y: { _text: comment.y }
}))

// Convert JFLAP JSON to Automatarium format
export const convertAutomatariumToJFLAP = (automatariumProject: Project): string => {
  const jsonToXml = {
    _declaration: {
      _attributes: { version: '1.0', encoding: 'UTF-8', standalone: 'no' }
    },
    _comment: "Created with love from Automatarium for JFLAP",
    structure: {
      type: PROJECT_TYPE_MAP[automatariumProject.projectType],
      automaton: {
        state: mapStates(automatariumProject.states, automatariumProject.initialState, automatariumProject.config.statePrefix),
        transition: mapTransitions(automatariumProject.transitions, automatariumProject.projectType),
        note: mapComments(automatariumProject.comments)
      }
    }
  }
  return json2xml(JSON.stringify(jsonToXml), { compact: true, spaces: 4 })
}
