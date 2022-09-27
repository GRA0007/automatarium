import { PDATransition } from "./graph";
import { Graph, Node, State } from "./interfaces/graph";

export class PDAState extends State {
    constructor(
        m_id: number,
        m_isFinal: boolean,
        private m_read: string | null = null,
        private m_remaining: string = "",
    ) {
        super(m_id, m_isFinal);
    }

    get read() {
        return this.m_read;
    }

    get remaining() {
        return this.m_remaining;
    }

    key() {
        return String(this.id + this.remaining);
    }
}

export class PDAGraph extends Graph<PDAState, PDATransition> {
    constructor(
        initial: Node<PDAState>,
        states: PDAState[],
        transitions: PDATransition[],
    ) {
        super(initial, states, transitions);
    }
    public isFinalState(node: Node<PDAState>) {
        return node.state.isFinal && node.state.remaining.length === 0;
    }

    public getSuccessors(node: Node<PDAState>) {
        const transitions = this.transitions.filter(
            (transition) => transition.from === node.state.id,
        );
        const successors: Node<PDAState>[] = [];
        for (const transition of transitions) {
            const nextState = this.states.find(
                (state) => state.id === transition.to,
            );
            const lambdaTransition = transition.read.length === 0;
            const symbol = node.state.remaining[0];
            if (
                nextState === undefined ||
                (!lambdaTransition && !transition.read.includes(symbol))
            ) {
                continue;
            }
            const graphState = new PDAState(
                nextState.id,
                nextState.isFinal,
                lambdaTransition ? "" : symbol,
                lambdaTransition
                    ? node.state.remaining
                    : node.state.remaining.slice(1),
            );
            const successor = new Node(graphState, node);
            successors.push(successor);
        }
        return successors;
    }
}
