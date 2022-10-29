import { PDATransition } from "./graph";
import { Node } from "./interfaces/graph";
import { PDAGraph, PDAState } from "./PDASearch";

export class GraphStepper<S extends PDAState, T extends PDATransition> {
    constructor(
        private graph: PDAGraph,
        private frontier: Node<PDAState>[] = [graph.initial],
    ) {}

    public forward() {
        const frontierCopy = this.frontier.slice();
        this.frontier = [];
        while (frontierCopy.length > 0) {
            const node = frontierCopy.shift()!;
            for (const successor of this.graph.getSuccessors(node)) {
                this.frontier.push(successor);
            }
        }
        return this.frontier;
    }

    public backward() {
        if (
            this.frontier.length === 1 &&
            this.frontier[0].state.key() === this.graph.initial.state.key()
        ) {
            // This is the root node!
            return this.frontier;
        }
        const previousFrontier: Node<PDAState>[] = [];
        this.frontier.forEach((node) => {
            if (
                node.parent &&
                !this.checkForDuplicate(node.parent, previousFrontier)
            ) {
                previousFrontier.push(node.parent);
            }
        });
        this.frontier = previousFrontier;
        return this.frontier;
    }

    private checkForDuplicate(node: Node<PDAState>, frontier: Node<PDAState>[]) {
        return frontier.some((n) => n.state.key() === node.state.key());
    }

    public reset() {
        this.frontier = [this.graph.initial];
        return this.frontier;
    }
}