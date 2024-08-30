import { ElementCompact, xml2js } from 'xml-js'

import { DEFAULT_PROJECT_COLOR, DEFAULT_STATE_PREFIX, DEFAULT_OR_OPERATOR, DEFAULT_ACCEPTANCE_CRITERIA, SCHEMA_VERSION, APP_VERSION } from 'frontend/src/config'
import {
  ProjectType,
  Project,
  assertType,
  PDAAutomataTransition, TMAutomataTransition
} from 'frontend/src/types/ProjectTypes'

const PROJECT_TYPE_MAP: Record<string, ProjectType> = {
  fa: 'FSA',
  pda: 'PDA',
  turing: 'TM'
}

// Convert JFLAP XML to Automatarium format
export const convertJFLAPXML = (xml: string): Project => {
  const jflapProject = xml2js(xml, { compact: true, ignoreComment: true, ignoreDeclaration: true })
  return convertJFLAPProject(jflapProject)
}

// Convert JFLAP JSON to Automatarium format
export const convertJFLAPProject = (jflapProject: ElementCompact): Project => {
  // Pull out necessary values from jflap project
  let {
    structure: {
      type,
      automaton: { state: states, transition: transitions, note: notes }
    }
  } = jflapProject
  const projectType = PROJECT_TYPE_MAP[type._text]

  // Check if format is unsupported
  if (!Object.keys(PROJECT_TYPE_MAP).includes(type._text)) {
    throw new Error(`Unsupported JFLAP project type "${type._text}"!`)
  }

  // Convert attributes to arrays if they are not already
  const toArray = <T>(x: T[]): T[] => x === undefined ? [] : (Array.isArray(x) ? x : [x])
  states = toArray(states)
  transitions = toArray(transitions)
  notes = toArray(notes)

  // Find initial state
  const initialState = states.find(s => s.initial)
  const initialStateID = Number(initialState._attributes.id)

  // Convert states
  const automatariumStates = states.map(state => ({
    id: Number(state._attributes.id),
    name: state._attributes.name,
    label: state.label ? state.label._text : '',
    x: Number(state.x._text),
    y: Number(state.y._text),
    isFinal: state.final !== undefined
  }))

  // Convert transitions
  const automatariumTransitions = transitions.map((transition, idx) => {
    const trans = {
      id: idx,
      from: Number(transition.from._text),
      to: Number(transition.to._text),
      read: transition.read._text ? transition.read._text : ''
    }
    // Add any extra fields if needed
    if (projectType === 'PDA') {
      assertType<PDAAutomataTransition>(trans)
      // Copy is needed to please type checker
      trans.push = transition.push._text ?? ''
      trans.pop = transition.pop._text ?? ''
      // We don't support multi character input at the moment
      if (trans.push.length > 1 || trans.pop.length > 1) {
        throw new Error("Automatarium doesn't support multi character input")
      }
    } else if (projectType === 'TM') {
      assertType<TMAutomataTransition>(trans)
      trans.write = transition.write._text ?? ''
      trans.direction = transition.move._text ?? ''
    }
    return trans
  })

  // Convert comments
  const automatariumComments = notes.map((note, idx) => ({
    id: idx,
    text: note.text._text,
    x: Number(note.x._text),
    y: Number(note.y._text)
  }))

  return {
    config: {
      type: projectType,
      statePrefix: DEFAULT_STATE_PREFIX,
      color: DEFAULT_PROJECT_COLOR[projectType],
      orOperator: DEFAULT_OR_OPERATOR,
      acceptanceCriteria: projectType === 'PDA' ? DEFAULT_ACCEPTANCE_CRITERIA : undefined
    },
    meta: {
      name: '', // Name will be changed to filename by frontend
      dateCreated: new Date().getTime(),
      dateEdited: new Date().getTime(),
      version: SCHEMA_VERSION,
      automatariumVersion: APP_VERSION
    },
    projectType,
    simResult: [],
    tests: {
      batch: [''],
      single: ''
    },
    initialState: initialStateID,
    states: automatariumStates,
    transitions: automatariumTransitions,
    comments: automatariumComments
  }
}
