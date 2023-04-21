import { TMGraph, TMState } from './TMSearch'
import { TMExecutionResult, TMExecutionTrace } from './graph'
import { Node } from './interfaces/graph'
import { breadthFirstSearch } from './search'
import { buildProblem, findInitialState, newTape } from './utils'
import { TMProjectGraph } from 'frontend/src/types/ProjectTypes'

const generateTrace = (node: Node<TMState>): TMExecutionTrace[] => {
  const trace: TMExecutionTrace[] = []
  while (node.parent) {
    trace.push({
      to: node.state.id,
      tape: node.state.tape
    })
    node = node.parent
  }
  trace.push({
    to: node.state.id,
    tape: node.state.tape
  })
  return trace.reverse()
}

export const simulateTM = (
  graph: TMProjectGraph,
  // This forces front end to through a tape
  input: string
): TMExecutionResult => {
  if (!findInitialState(graph)) {
    return {
      halted: false,
      tape: newTape(input),
      trace: []
    }
  }

  const problem = buildProblem(graph, input) as TMGraph
  const result = breadthFirstSearch(problem)

  if (!result) {
    return {
      trace: [{ to: 0, tape: null }],
      halted: false,
      tape: newTape(input)
    }
  }
  return {
    halted: result.state.isFinal,
    tape: result.state.tape,
    trace: generateTrace(result)
  }
}
