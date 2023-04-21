import { FSAGraph, FSAState } from './FSASearch'
import { GraphStepper } from './Step'
import { ExecutionResult, ExecutionTrace, UnparsedGraph } from './graph'
import { Node } from './interfaces/graph'
import { expandReadSymbols, resolveGraph } from './parseGraph'
import { breadthFirstSearch } from './search'
import { FSAProjectGraph } from 'frontend/src/types/ProjectTypes'

const generateTrace = (node: Node<FSAState>): ExecutionTrace[] => {
  const trace: ExecutionTrace[] = []
  while (node.parent) {
    trace.push({
      to: node.state.id,
      read: node.state.read
    })
    node = node.parent
  }
  trace.push({
    to: node.state.id,
    read: null
  })
  return trace.reverse()
}

// TODO: Like PDA, Make this take a FSAGraph instead
export const simulateFSA = (
  graph: FSAProjectGraph,
  input: string
): ExecutionResult => {
  // Doing this find here so we don't have to deal with undefined in the class
  const initialState = graph.states.find((state) => {
    return state.id === graph.initialState
  })

  if (!initialState) {
    return {
      accepted: false,
      remaining: input,
      trace: []
    }
  }

  const initialNode = new Node<FSAState>(
    new FSAState(initialState.id, initialState.isFinal, null, input)
  )

  const states = graph.states.map(
    (state) => new FSAState(state.id, state.isFinal)
  )

  const problem = new FSAGraph(
    initialNode,
    states,
    // We need to expand the read symbols in the transitions
    graph.transitions.map(t => ({ ...t, read: expandReadSymbols(t.read) }))
  )
  const result = breadthFirstSearch(problem)

  if (!result) {
    return {
      trace: [{ to: 0, read: null }],
      accepted: false,
      remaining: input
    }
  }

  return {
    accepted: result.state.isFinal && result.state.remaining === '',
    remaining: result.state.remaining,
    trace: generateTrace(result)
  }
}

export const graphStepper = (graph: UnparsedGraph, input: string) => {
  const parsedGraph = resolveGraph(graph)

  const initialState = parsedGraph.states.find((state) => {
    return state.id === graph.initialState
  })

  if (!initialState) {
    return {
      accepted: false,
      remaining: input,
      trace: []
    }
  }

  const initialNode = new Node<FSAState>(
    new FSAState(initialState.id, initialState.isFinal, null, input)
  )

  const states = parsedGraph.states.map(
    (state) => new FSAState(state.id, state.isFinal)
  )

  const problem = new FSAGraph(initialNode, states, parsedGraph.transitions)

  return new GraphStepper(problem)
}
