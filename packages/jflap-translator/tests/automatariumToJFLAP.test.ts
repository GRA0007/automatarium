import { convertAutomatariumToJFLAP } from '../src'
import { readFileSync } from 'fs'
import { Project } from 'frontend/src/types/ProjectTypes'
import { ElementCompact, xml2js } from 'xml-js'

const readProject = (name: string): ElementCompact => {
  const jsonData = readFileSync('tests/sample-automatarium-data/' + name + '.json').toString()
  const project = JSON.parse(jsonData) as Project
  return xml2js(convertAutomatariumToJFLAP(project), { compact: true })
}

describe('FSA single state', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-single-state-placed')

  test('state should be placeable', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      state: {
        _attributes: {
          id: '0',
          name: 'q0'
        },
        x: { _text: '100' },
        y: { _text: '150' },
        initial: {}
      }
    })
  })
})

describe('FSA single state (w/ project set state identifier)', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-single-state-different-identifier')

  test('state should be prefixed with "x"', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      state: {
        _attributes: {
          id: '0',
          name: 'x0'
        },
        x: { _text: '100' },
        y: { _text: '150' },
        initial: {}
      }
    })
  })
})

describe('FSA single state (w/ renamed state)', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-single-state-renamed')

  test('state should be renamed', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      state: {
        _attributes: {
          id: '0',
          name: 'y0'
        },
        x: { _text: '100' },
        y: { _text: '150' },
        initial: {}
      }
    })
  })
})

describe('FSA single state (w/ state label)', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-single-state-labelled')

  test('state should contain label', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      state: {
        _attributes: {
          id: '0',
          name: 'q0'
        },
        label: { _text: 'label text' },
        x: { _text: '100' },
        y: { _text: '150' },
        initial: {}
      }
    })
  })
})

describe('FSA single state (w/ self transition)', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-single-state-self-transition-x')

  test('state should have a self transition with read "x"', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      state: {
        _attributes: {
          id: '0',
          name: 'q0'
        },
        x: { _text: '100' },
        y: { _text: '150' },
        initial: {}
      },
      transition: {
        from: { _text: '0' },
        to: { _text: '0' },
        read: { _text: 'x' }
      }
    }
    )
  })
})

describe('FSA single state (w/ self lambda transition)', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-single-state-self-transition-lambda')

  test('state should have a self transition with read "" (lambda)', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      state: {
        _attributes: {
          id: '0',
          name: 'q0'
        },
        x: { _text: '100' },
        y: { _text: '150' },
        initial: {}
      },
      transition: {
        from: { _text: '0' },
        to: { _text: '0' },
        read: {}
      }
    })
  })
})

describe('FSA multi-state (w/ regular transitions)', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-multi-state-transition')

  test('transitions should exist', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      state: [
        {
          _attributes: {
            id: '0',
            name: 'q0'
          },
          x: { _text: '100' },
          y: { _text: '150' },
          initial: {}
        },
        {
          _attributes: {
            id: '1',
            name: 'q1'
          },
          x: { _text: '300' },
          y: { _text: '150' },
          final: {}
        }
      ],
      transition: [
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: { _text: 'a' }
        },
        {
          from: { _text: '1' },
          to: { _text: '0' },
          read: {}
        }
      ]
    })
  })
})

describe('FSA multi-state (w/ transition expansion)', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-multi-state-transition-expansion')

  test('transition should expand to abcd', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      state: [
        {
          _attributes: {
            id: '0',
            name: 'q0'
          },
          x: { _text: '100' },
          y: { _text: '150' },
          initial: {}
        },
        {
          _attributes: {
            id: '1',
            name: 'q1'
          },
          x: { _text: '300' },
          y: { _text: '150' },
          final: {}
        }
      ],
      transition: [
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: { _text: 'a' }
        },
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: { _text: 'b' }
        },
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: { _text: 'c' }
        },
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: { _text: 'd' }
        }
      ]
    })
  })
})

// // empty project with comment - no-states-comment-only
describe('FSA no states (comment only)', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-no-states-comment-only')

  test('project should only contain comment', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      note: {
        text: { _text: 'project with comment only' },
        x: { _text: '100' },
        y: { _text: '150' }
      }
    })
  })
})

describe('FSA single state (final state)', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-single-state-final')

  test('state should be final', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      state: {
        _attributes: {
          id: '0',
          name: 'q0'
        },
        x: { _text: '100' },
        y: { _text: '150' },
        initial: {},
        final: {}
      }
    })
  })
})

describe('FSA multi-test', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('fsa-multi-test')

  test('states should have correct structure and attributes', () => {
    expect(type).toBe('fa')
    expect(automaton).toStrictEqual({
      state: [
        {
          _attributes: {
            id: '0',
            name: 'blank'
          },
          label: { _text: 'blank label' },
          x: { _text: '100' },
          y: { _text: '150' },
          initial: {}
        },
        {
          _attributes: {
            id: '1',
            name: 'q1'
          },
          x: { _text: '300' },
          y: { _text: '150' },
          final: {}
        }
      ],
      transition: [
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: { _text: 'a' }
        },
        {
          from: { _text: '1' },
          to: { _text: '1' },
          read: {}
        }
      ],
      note: {
        text: { _text: 'test comment' },
        x: { _text: '300' },
        y: { _text: '300' }
      }
    })
  })
})

describe('PDA empty transition', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('pda-empty-transition')

  test('project should contain an empty transition', () => {
    expect(type).toBe('pda')
    expect(automaton).toStrictEqual({
      state: [
        {
          _attributes: {
            id: '0',
            name: 'q0'
          },
          x: { _text: '100' },
          y: { _text: '150' },
          initial: {}
        },
        {
          _attributes: {
            id: '1',
            name: 'q1'
          },
          x: { _text: '300' },
          y: { _text: '150' },
          final: {}
        }
      ],
      transition: {
        from: { _text: '0' },
        to: { _text: '1' },
        read: {},
        pop: {},
        push: {}
      }
    })
  })
})

describe('PDA balanced brackets', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('pda-simple-balanced-brackets')

  test('project should have correct structure and attributes', () => {
    expect(type).toBe('pda')
    expect(automaton).toStrictEqual({
      state: [
        {
          _attributes: {
            id: '0',
            name: 'q0'
          },
          x: { _text: '100' },
          y: { _text: '150' },
          initial: {}
        },
        {
          _attributes: {
            id: '1',
            name: 'q1'
          },
          x: { _text: '300' },
          y: { _text: '150' },
          final: {}
        }
      ],
      transition: [
        {
          from: { _text: '0' },
          to: { _text: '0' },
          read: { _text: '(' },
          pop: {},
          push: { _text: 'A' }
        },
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: {},
          pop: {},
          push: {}
        },
        {
          from: { _text: '1' },
          to: { _text: '1' },
          read: { _text: ')' },
          pop: { _text: 'A' },
          push: {}
        }
      ]
    })
  })
})

describe('PDA multi-test', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('pda-multi-test')

  test('project should have correct structure and attributes', () => {
    expect(type).toBe('pda')
    expect(automaton).toStrictEqual({
      state: [
        {
          _attributes: {
            id: '0',
            name: 'q0'
          },
          x: { _text: '100' },
          y: { _text: '150' },
          initial: {}
        },
        {
          _attributes: {
            id: '1',
            name: 'q1'
          },
          x: { _text: '300' },
          y: { _text: '150' }
        },
        {
          _attributes: {
            id: '2',
            name: 'q2'
          },
          x: { _text: '100' },
          y: { _text: '300' },
          final: {}
        }
      ],
      transition: [
        {
          from: { _text: '0' },
          to: { _text: '0' },
          read: { _text: '(' },
          pop: {},
          push: { _text: 'A' }
        },
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: { _text: 'a' },
          pop: {},
          push: {}
        },
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: { _text: 'b' },
          pop: {},
          push: {}
        },
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: { _text: 'c' },
          pop: {},
          push: {}
        },
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: { _text: 'd' },
          pop: {},
          push: {}
        },
        {
          from: { _text: '1' },
          to: { _text: '1' },
          read: { _text: ')' },
          pop: { _text: 'A' },
          push: {}
        },
        {
          from: { _text: '1' },
          to: { _text: '2' },
          read: {},
          pop: {},
          push: {}
        }
      ]
    })
  })
})

describe('TM multiple directions', () => {
  const {
    structure: {
      type: { _text: type },
      automaton
    }
  } = readProject('tm-multiple-directions')

  test('project should have one transition for each direction', () => {
    expect(type).toBe('turing')
    expect(automaton).toStrictEqual({
      state: [
        {
          _attributes: {
            id: '0',
            name: 'q0'
          },
          x: { _text: '100' },
          y: { _text: '150' },
          initial: {}
        },
        {
          _attributes: {
            id: '1',
            name: 'q1'
          },
          x: { _text: '300' },
          y: { _text: '150' }
        },
        {
          _attributes: {
            id: '2',
            name: 'q2'
          },
          x: { _text: '100' },
          y: { _text: '300' },
          final: {}
        }
      ],
      transition: [
        {
          from: { _text: '0' },
          to: { _text: '1' },
          read: {},
          write: { _text: 'x' },
          move: { _text: 'R' }
        },
        {
          from: { _text: '1' },
          to: { _text: '1' },
          read: {},
          write: { _text: 'y' },
          move: { _text: 'L' }
        },
        {
          from: { _text: '1' },
          to: { _text: '2' },
          read: { _text: 'x' },
          write: { _text: 'y' },
          move: { _text: 'S' }
        }
      ]
    })
  })
})
