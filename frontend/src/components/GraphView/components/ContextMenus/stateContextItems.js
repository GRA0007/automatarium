const stateContextItems = [
  {
    label: 'Set as initial',
    action: 'SET_STATE_INITIAL',
  },
  {
    label: 'Toggle is final',
    action: 'TOGGLE_STATES_FINAL',
  },
  'hr',
  {
    label: 'Set label',
    action: 'SET_STATE_LABEL',
  },
  'hr',
  {
    label: 'Change name',
    action: 'SET_STATE_NAME',
  },
  'hr',
  {
    label: 'Copy',
    action: 'COPY',
  },
  {
    label: 'Paste',
    action: 'PASTE',
  },
  'hr',
  {
    label: 'Delete',
    shortcut: '⌫',
    action: 'DELETE'
  },
]

export default stateContextItems
