import { convertNFAtoDFA } from '../src/convert'
import convertSimpleConversion from './graphs/convertSimpleConversion.json'
import convertSimpleConversionDFA from './graphs/convertSimpleConversionDFA.json'
import convertHarderConversion from './graphs/convertHarderConversion.json'
import convertHarderConversionDFA from './graphs/convertHarderConversionDFA.json'
import convertMultipleFinal from './graphs/convertMultipleFinal.json'
import convertMultipleFinalDFA from './graphs/convertMultipleFinalDFA.json'
import convertInitialNotAtStart from './graphs/convertInitialNotAtStart.json'
import convertInitialNotAtStartDFA from './graphs/convertInitialNotAtStartDFA.json'
import convertSingleTrapState from './graphs/convertSingleTrapState.json'
import convertSingleTrapStateDFA from './graphs/convertSingleTrapStateDFA.json'
import infiniteLoop from './graphs/infiniteLoop.json'
import infiniteLoopDFA from './graphs/infiniteLoopDFA.json'
import nfaWithORSymbolsExpected from './graphs/nfaWithORSymbolsExpected.json'
import nfaWithORSymbolsInput from './graphs/nfaWithORSymbolsInput.json'
import nfaWithRangeInput from './graphs/nfaWithRangeInput.json'
import nfaWithRangeExpected from './graphs/nfaWithRangeExpected.json'
import { FSAProjectGraph } from 'frontend/src/types/ProjectTypes'

// Required because we can't do `as const` to the imported JSON.
// Means we don't need `as FSAProjectGraph` everywhere
type LooseFSA = Omit<FSAProjectGraph, 'projectType'> & {projectType: string}

const convertToDFA = (project: LooseFSA): FSAProjectGraph => {
  return convertNFAtoDFA(project as FSAProjectGraph)
}

describe('Check to ensure DFA graph is displayed as expected', () => {
  const expectDFA = (nfa: LooseFSA, dfa: LooseFSA) => {
    const graph = convertToDFA(nfa)
    // Only compare fields that are in FSAProjectGraph
    expect(graph.initialState).toEqual(dfa.initialState)
    expect(graph.states).toEqual(dfa.states)
    expect(graph.transitions).toEqual(dfa.transitions)
  }
  test('Graph should be converted correctly to DFA under simple conditions (1 symbol)', () => {
    expectDFA(convertSimpleConversion, convertSimpleConversionDFA)
  })
  test('Graph should be converted correctly to DFA when initial state is not at the start', () => {
    expectDFA(convertInitialNotAtStart, convertInitialNotAtStartDFA)
  })
  test('Graph should be converted correctly to DFA with multiple final states', () => {
    expectDFA(convertMultipleFinal, convertMultipleFinalDFA)
  })
  test('Graph should be converted correctly to DFA under harder conditions (2 symbols)', () => {
    expectDFA(convertHarderConversion, convertHarderConversionDFA)
  })
  test('Graph should use a single trap state instead of multiple when converted to a DFA', () => {
    expectDFA(convertSingleTrapState, convertSingleTrapStateDFA)
  })
  test('Graph should successfully handle multiple self transitions', () => {
    expectDFA(infiniteLoop, infiniteLoopDFA)
  })
  test('Each character in an OR should be checked', () => {
    expectDFA(nfaWithORSymbolsInput, nfaWithORSymbolsExpected)
  })
  test('Ranges should be expanded before processing NFA', () => {
    expectDFA(nfaWithRangeInput, nfaWithRangeExpected)
  })
})
