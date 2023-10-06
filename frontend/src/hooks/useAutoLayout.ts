import GemLayoutAlgorithm from '/src/providers/Layouts/GemLayoutAlgorithm'
import { ProjectGraph } from '/src/types/ProjectTypes'

const useAutoLayout = (graph: ProjectGraph, algorithm: (graph: ProjectGraph) => ProjectGraph = GemLayoutAlgorithm) => {
  return algorithm(graph)
}

export default useAutoLayout
