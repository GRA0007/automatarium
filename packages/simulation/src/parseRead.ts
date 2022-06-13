import { RANGE_VALS } from './expandReadSymbols'

type RangeOpenToken =  { kind: 'range_open' }
type RangeCloseToken = { kind: 'range_close' }
type RangeSepToken =   { kind: 'range_sep' }
type LiteralToken =    { kind: 'literal', value: string, }
type ReadToken = LiteralToken | RangeOpenToken | RangeCloseToken | RangeSepToken

type LiteralNode = {
  kind: 'literal',
  value: string,
}

type RangeNode = {
  kind: 'range',
  start: string,
  stop: string,
}

type ReadNode = LiteralNode | RangeNode

const parseRead = (read: string): ReadNode[] => {
  const tokens = tokeniseRead(read)
  let nodes: ReadNode[] = []
  let rangeNode
  for (let token of tokens) {
    // Literals
    if (token.kind === 'literal') {
      if (!rangeNode) {
        nodes.push({ kind: 'literal', value: token.value })
      } else {
        if (!rangeNode.seperator) {
          if (rangeNode.start)
            throw new ReadSyntaxError('Encountered unexpected duplicate start literal. Consider adding a "-" seperator')
          rangeNode.start = token.value
        } else {
          if (rangeNode.stop)
            throw new ReadSyntaxError('Encountered unexpected duplicate stop literal')
          if (rangeNode.start == token.value)
            throw new ReadSyntaxError('Encountered range with duplicate symbols')
          rangeNode.stop = token.value
        }
      }
    }

    // Start new range
    if (token.kind === 'range_open') {
      if (rangeNode)
        throw new ReadSyntaxError('Encountered unexpected range opening bracket inside of existing range')
      rangeNode = { kind: 'range', start: null, stop: null, seperator: false }
    }

    // Close existing range
    if (token.kind === 'range_close') {
      if (!rangeNode)
        throw new ReadSyntaxError('Encountered unexpected range closing bracket outside of range')
      if (!rangeNode.seperator)
        throw new ReadSyntaxError('Encountered unexpected range closing bracket before seperator')
      if (!rangeNode.start)
        throw new ReadSyntaxError('Encountered unexpected range closing bracket before start symbol literal')
      if (!rangeNode.stop)
        throw new ReadSyntaxError('Encountered unexpected range closing bracket before stop symbol literal')
      nodes.push({ kind: 'range', start: rangeNode.start, stop: rangeNode.stop })
      rangeNode = undefined
    }

    // Seperate range
    if (token.kind === 'range_sep') {
      if (!rangeNode)
        throw new ReadSyntaxError('Encounted unexpected range seperator outside')
      if (!rangeNode.start)
        throw new ReadSyntaxError('Encountered unexpected range seperator before start symbol literal')
      if (rangeNode.seperator)
        throw new ReadSyntaxError('Encountered unexpected duplicated range seperator')
      rangeNode.seperator = true
    }
  }

  // Are ranges correct order?
  for (let range of nodes.filter(n => n.kind === 'range') as RangeNode[]) {
    if (RANGE_VALS.indexOf(range.stop) < RANGE_VALS.indexOf(range.start))
      throw new ReadSyntaxError('Encountered range with incorrectly ordered symbols')
  }

  // Did reach end of input w/o closing / speratoer?
  if (rangeNode)
    throw new ReadSyntaxError('Expected range expression to be closed')

  return nodes
}

const tokeniseRead = (read: string): ReadToken[] => {
  return read
    .split('')
    .map(c => {
      if (c === '[') return { kind: 'range_open' }
      if (c === ']') return { kind: 'range_close' }
      if (c === '-') return { kind: 'range_sep' }
      return { kind: 'literal', value: c }
    })
}

class ReadSyntaxError extends Error { }

export default parseRead
