import { FSAAutomataTransition, FSAProjectGraph } from 'frontend/src/types/ProjectTypes'
import { expandReadSymbols } from './parseGraph'

/**
 * Makes a label for a set of states.
 * States are sorted first e.g. [2, 0, 1] => "0, 1, 2".
 * If there are no states then it assumes its the trap state (and returns 'Trap')
 */
const makeStateLabel = (states: number[]): string => {
  return states.length === 0 ? 'Trap' : states.sort((a, b) => a - b).join(', ')
}

/**
 * Returns all read symbols for a transition
 */
const readSymbols = (t: FSAAutomataTransition): string[] => {
  return t.read ? expandReadSymbols(t.read).split('') : ['']
}

/**
 * Converts an NFA into a DFA.
 * The steps are
 *  1. Get the initial set of states by exploring any lambda transitions from the NFA initial state
 *  2. Add that to the frontier
 *  3. Pop a set of states off the frontier. If nothing left then go to step 7
 *  4. Build state for that set
 *  5. Explore each letter in the NFA's alphabet to generate the new sets
 *  6. add those sets to the frontier
 *  7. Add the transitions in using the new states
 */
export const convertNFAtoDFA = (nfa: FSAProjectGraph): FSAProjectGraph => {
  // Just in case
  if (nfa.initialState === null) return nfa
  // Build an adjacency list for the NFA to make operations easier.
  // It is a mapping of stateID -> (read symbol -> states that reaches).
  const graphList = new Map<number, Map<string, Set<number>>>()
  for (const t of nfa.transitions) {
    // Create the second map if it doesn't exist
    if (!graphList.has(t.from)) graphList.set(t.from, new Map())
    // Now add the state in
    const forState = graphList.get(t.from)
    for (const symbol of readSymbols(t)) {
      if (!forState.has(symbol)) forState.set(symbol, new Set())
      forState.get(symbol).add(t.to)
    }
  }

  /**
   * Returns all states that can be reached by either reading lambdas or by reading the symbol.
   * The read will only be performed once, but lambdas will always be traversed.
   * This was used instead of `validTransitions` since that doesn't handle transitions like λ -> A -> λ (It should return the last two)
   * and FSASearch only searches one step ahead
   */
  const explore = (initialStates: number[], read: string): Set<number> => {
    // Frontier of nodes to explore.
    // canRead is used to track if the symbol has been read yet for a path
    const frontier = initialStates.map(s => ({ canRead: true, state: s }))
    // Store a set of state + read symbol to check we aren't entering a state with a symbol we have used before.
    // We can't just store state since we need to track if we have both seen a state and seen it by already reading
    const seen = new Set<string>()
    const result = new Set<number>()

    while (frontier.length) {
      const { canRead, state } = frontier.pop()
      const readTable = graphList.get(state)
      // If there are no transitions, ignore
      if (!readTable) continue
      /**
       * Helper function to add transitions that are reachable by reading a certain symbol.
       */
      const addTransitions = (symbol: string) => {
        const states = readTable.get(symbol) || []
        for (const state of states) {
          // The key will be a combo of the state plus if we can read while in that state
          const seenKey = state.toString() + (canRead && symbol === '')
          if (!seen.has(seenKey)) {
            seen.add(seenKey)
            // We can only continue reading if we haven't read the symbol yet
            frontier.push({ canRead: canRead && symbol === '', state })
            // But we only want to add states if we have actually read something (since that means a transitions has happened)
            if (!canRead || symbol === read) { result.add(state) }
          }
        }
      }

      // Add states that we can reach by reading the symbol
      if (canRead) {
        addTransitions(read)
      }
      // Add any states we can reach by going through a lambda
      addTransitions('')
    }
    return result
  }

  // Build information about the graph
  const alphabet = new Set(nfa.transitions.flatMap(t => readSymbols(t)))
  const finalStates = new Set(nfa.states.flatMap(s => s.isFinal ? [s.id] : []))
  // Find position of first node. Doesn't matter really, and we should just auto format + zoom to fit
  const initialPos = { x: nfa.states[0].x, y: nfa.states[0].y }
  // Mapping from DFA state label to its ID
  const labelMapping = new Map<string, number>()
  // An adjacency list we will build for the DFA
  const dfaTable = new Map<string, { read: string, to: string }[]>()
  // Our initial state is any state from the NFA's initial state that we can reach via lambdas
  const dfaInitialStates = [...explore([nfa.initialState], '').add(nfa.initialState)]
  const frontier: number[][] = [dfaInitialStates]
  // Track seen states so we don't go into any loops
  const seen = new Set<string>([makeStateLabel(dfaInitialStates)])
  // Make a copy of the graph and reset the values and make the DFA off of that
  const dfa = structuredClone(nfa)
  dfa.states = []
  dfa.transitions = []
  dfa.initialState = 0 // It gets reset to 0
  // Helper to get the next ID for item (I am too lazy to ++variable)
  const nextID = (x: {id: number}[]): number => (x[x.length - 1]?.id ?? -1) + 1
  //
  // Main loop in the conversion process
  //
  while (frontier.length) {
    const curr = frontier.pop()
    const currKey = makeStateLabel(curr)
    // Create a new state which represents the set of NFA states
    const id = nextID(dfa.states)
    dfa.states.push({
      id,
      label: currKey,
      ...initialPos,
      isFinal: curr.some(s => finalStates.has(s)) // If any of the states are final, then the new state is final
    })
    labelMapping.set(currKey, id)
    // Make sure the table can receive info for it
    dfaTable.set(currKey, [])
    // For every state in the closure, see what states we can be in
    // by trying to read everything in the alphabet
    for (const symbol of alphabet) {
      // Remove lambda transitions
      if (symbol === '') continue

      // Find distinct states we can be in by either reading a lambda or reading the symbol
      const states = [...explore(curr, symbol)]
      // Check if its a new state that we need to explore
      const key = makeStateLabel(states)
      if (!seen.has(key)) {
        // Make it seen so we don't add it again
        seen.add(key)
        // We will explore it later
        frontier.push(states)
      }
      // Add the transition
      dfaTable.get(currKey).push({ read: symbol, to: key })
    }
  }

  // Now that the states are all found, we need to add the transitions in
  for (const [label, transitions] of dfaTable) {
    for (const transition of transitions) {
      dfa.transitions.push({
        id: nextID(dfa.transitions),
        from: labelMapping.get(label),
        to: labelMapping.get(transition.to),
        read: transition.read
      })
    }
  }
  return dfa
}
