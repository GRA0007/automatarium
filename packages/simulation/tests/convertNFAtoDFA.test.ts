import { reorderStates } from '../src/reorder'
import { convertNFAtoDFA } from '../src/convert'
import convertFinalNotPresent from './graphs/convertFinalNotPresent.json'
import convertInitialNotPresent from './graphs/convertInitialNotPresent.json'
import convertNoStatesOrTransitionsPresent from './graphs/convertNoStatesOrTransitionsPresent.json'
import convertFinalNotReachable from './graphs/convertFinalNotReachable.json'
import convertSimpleConversion from './graphs/convertSimpleConversion.json'
import convertHarderConversion from './graphs/convertHarderConversion.json'
import convertMultipleFinal from './graphs/convertMultipleFinal.json'
import convertInitialNotAtStart from './graphs/convertInitialNotAtStart.json'

describe('Check to ensure NFA graph is valid before conversion begins', () => {
  test('Graph should not be processed for conversion if there are no final states', () => {
    try {
      reorderStates(convertNFAtoDFA(reorderStates(convertFinalNotPresent as any) as any) as any)
      fail('Expected an error to be thrown')
    } catch (error) {
      expect(error.message).toBe('Error: Graph is not suitable for conversion. Please ensure that at least one final state is declared.')
    }
  })

  test('Graph should not be processed for conversion if there are no initial states', () => {
    try {
      reorderStates(convertNFAtoDFA(reorderStates(convertInitialNotPresent as any) as any) as any)
      fail('Expected an error to be thrown')
    } catch (error) {
      expect(error.message).toBe('Error: Graph is not suitable for conversion. Please ensure that an initial state is declared.')
    }
  })

  test('Graph should not be processed for conversion if there are no states or transitions', () => {
    try {
      reorderStates(convertNFAtoDFA(reorderStates(convertNoStatesOrTransitionsPresent as any) as any) as any)
      fail('Expected an error to be thrown')
    } catch (error) {
      expect(error.message).toBe('Error: Graph is not suitable for conversion. Please ensure you have both states and transitions present.')
    }
  })

  test('Graph should not be processed for conversion if there are no reachable final states', () => {
    try {
      reorderStates(convertNFAtoDFA(reorderStates(convertFinalNotReachable as any) as any) as any)
      fail('Expected an error to be thrown')
    } catch (error) {
      expect(error.message).toBe('Error: Graph is not suitable for conversion. Please ensure your final state is able to be reached by the initial state.')
    }
  })
})

describe('Check to ensure DFA graph is displayed as expected', () => {
  test('Graph should be converted correctly to DFA under simple conditions (1 symbol)', () => {
    const graph = reorderStates(convertNFAtoDFA(reorderStates(convertSimpleConversion as any) as any) as any)
    // Initial state should be q0
    expect(graph.initialState).toBe(0)
    // They would be 3 if they got returned as a DFA rather than 4 as an NFA
    expect(graph.states.length).toBe(3)
    // Only q1 should be a final state
    expect((graph.states.find((state) => state.id === 0)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 1)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 2)).isFinal).toBe(false)
    // No lambda transition should be found, and should be 3 transitions total. All transitions should have symbol "A"
    expect(graph.transitions.length).toBe(3)
    expect(graph.transitions.some((transition) => transition.read === undefined)).toBe(false)
    expect(graph.transitions.every((transition) => transition.read === 'A')).toBe(true)
    // Transitions should go in a straight line except the trap state, which goes to itself
    expect(graph.transitions[0].from).toBe(0)
    expect(graph.transitions[0].to).toBe(1)
    expect(graph.transitions[1].from).toBe(1)
    expect(graph.transitions[1].to).toBe(2)
    expect(graph.transitions[2].from).toBe(2)
    expect(graph.transitions[2].to).toBe(2)
  })
  test('Graph should be converted correctly when initial state is not at the start', () => {
    const graph = reorderStates(convertNFAtoDFA(reorderStates(convertInitialNotAtStart as any) as any) as any)
    // Initial state should be q0
    expect(graph.initialState).toBe(0)
    // They would be 3 if they got returned as a DFA rather than 4 as an NFA
    expect(graph.states.length).toBe(3)
    // Only q1 should be a final state
    expect((graph.states.find((state) => state.id === 0)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 1)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 2)).isFinal).toBe(false)
    // No lambda transition should be found, and should be 3 transitions total. All transitions should have symbol "A"
    expect(graph.transitions.length).toBe(3)
    expect(graph.transitions.some((transition) => transition.read === undefined)).toBe(false)
    expect(graph.transitions.every((transition) => transition.read === 'A')).toBe(true)
    // Transitions should go in a straight line except the trap state, which goes to itself
    expect(graph.transitions[0].from).toBe(0)
    expect(graph.transitions[0].to).toBe(1)
    expect(graph.transitions[1].from).toBe(1)
    expect(graph.transitions[1].to).toBe(2)
    expect(graph.transitions[2].from).toBe(2)
    expect(graph.transitions[2].to).toBe(2)
  })
  test('Graph should be converted correctly to DFA with multiple final states', () => {
    const graph = reorderStates(convertNFAtoDFA(reorderStates(convertMultipleFinal as any) as any) as any)
    // Initial state should be q0
    expect(graph.initialState).toBe(0)
    // They would be 3 if they got returned as a DFA rather than 4 as an NFA
    expect(graph.states.length).toBe(3)
    // Only q1 should be a final state
    expect((graph.states.find((state) => state.id === 0)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 1)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 2)).isFinal).toBe(false)
    // No lambda transition should be found, and should be 3 transitions total. All transitions should have symbol "A"
    expect(graph.transitions.length).toBe(3)
    expect(graph.transitions.some((transition) => transition.read === undefined)).toBe(false)
    expect(graph.transitions.every((transition) => transition.read === 'A')).toBe(true)
    // Transitions should go in a straight line except the trap state, which goes to itself
    expect(graph.transitions[0].from).toBe(0)
    expect(graph.transitions[0].to).toBe(1)
    expect(graph.transitions[1].from).toBe(1)
    expect(graph.transitions[1].to).toBe(2)
    expect(graph.transitions[2].from).toBe(2)
    expect(graph.transitions[2].to).toBe(2)
  })
  test('Graph should be converted correctly to DFA under harder conditions (2 symbols)', () => {
    const graph = reorderStates(convertNFAtoDFA(reorderStates(convertHarderConversion as any) as any) as any)
    // Initial state should be q0
    expect(graph.initialState).toBe(0)
    // They would be 6 if they got returned as a DFA rather than 4 as an NFA
    expect(graph.states.length).toBe(6)
    // Should be two final states, q2 and q3
    expect((graph.states.find((state) => state.id === 0)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 1)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 2)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 3)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 4)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 5)).isFinal).toBe(false)
    // No lambda transition should be found, and should be 12 transitions total. All states should have a single transition 'A' and 'B' from, and be connected in a certain way
    expect(graph.transitions.length).toBe(12)
    expect(graph.transitions.some((transition) => transition.read === undefined)).toBe(false)
    expect(graph.transitions.every((transition) => transition.read === 'A' || transition.read === 'B')).toBe(true)
    // Transitions should be connected appropriately
    expect(graph.transitions.filter((transition) => transition.from === 0).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 0)[0].to).toBeOneOf([1, 3])
    expect(graph.transitions.filter((transition) => transition.from === 0)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 0)[1].to).toBeOneOf([1, 3])
    expect(graph.transitions.filter((transition) => transition.from === 0)[1].read).toBeOneOf(['A', 'B'])

    expect(graph.transitions.filter((transition) => transition.from === 1).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 1)[0].to).toBeOneOf([2, 1])
    expect(graph.transitions.filter((transition) => transition.from === 1)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 1)[1].to).toBeOneOf([2, 1])
    expect(graph.transitions.filter((transition) => transition.from === 1)[1].read).toBeOneOf(['A', 'B'])

    expect(graph.transitions.filter((transition) => transition.from === 2).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 2)[0].to).toBe(4)
    expect(graph.transitions.filter((transition) => transition.from === 2)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 2)[1].to).toBe(4)
    expect(graph.transitions.filter((transition) => transition.from === 2)[1].read).toBeOneOf(['A', 'B'])

    expect(graph.transitions.filter((transition) => transition.from === 3).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 3)[0].to).toBe(5)
    expect(graph.transitions.filter((transition) => transition.from === 3)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 3)[1].to).toBe(5)
    expect(graph.transitions.filter((transition) => transition.from === 3)[1].read).toBeOneOf(['A', 'B'])

    expect(graph.transitions.filter((transition) => transition.from === 4).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 4)[0].to).toBe(4)
    expect(graph.transitions.filter((transition) => transition.from === 4)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 4)[1].to).toBe(4)
    expect(graph.transitions.filter((transition) => transition.from === 4)[1].read).toBeOneOf(['A', 'B'])

    expect(graph.transitions.filter((transition) => transition.from === 5).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 5)[0].to).toBe(5)
    expect(graph.transitions.filter((transition) => transition.from === 5)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 5)[1].to).toBe(5)
    expect(graph.transitions.filter((transition) => transition.from === 5)[1].read).toBeOneOf(['A', 'B'])
  })
})
