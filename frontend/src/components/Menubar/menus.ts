import { APP_VERSION } from '/src/config/projects'
import { ContextItems } from '/src/components/ContextMenus/contextItem'

const menus: ContextItems = [
  {
    label: 'File',
    items: [
      {
        label: 'New...',
        action: 'NEW_FILE'
      },
      // TODO: Support dynamic menu items to show recent files
      // {
      //   label: 'Open recent',
      //   items: [
      //     // { label: 'Test file' },
      //     // { label: 'Another test file' },
      //     // { label: 'Best NFA' },
      //     // { label: 'Turing machine' },
      //   ],
      // },
      'hr',
      {
        label: 'Import',
        items: [
          {
            label: 'Import Automatarium file',
            action: 'IMPORT_AUTOMATARIUM_PROJECT'
          },
          {
            label: 'Import JFLAP file',
            action: 'IMPORT_JFLAP_PROJECT'
          },
          {
            label: 'Import other...',
            action: 'IMPORT_DIALOG'
          }
        ]
      },
      {
        label: 'Export',
        items: [
          {
            label: 'Export image...',
            action: 'EXPORT'
          },
          {
            label: 'Quick export as PNG',
            action: 'EXPORT_AS_PNG'
          },
          {
            label: 'Quick export as SVG',
            action: 'EXPORT_AS_SVG'
          },
          {
            label: 'Quick copy to clipboard',
            action: 'EXPORT_TO_CLIPBOARD'
          },
          'hr',
          {
            label: 'Export as an Automatarium file',
            action: 'SAVE_FILE_AS'
          },
          {
            label: 'Export as a JFLAP file',
            action: 'EXPORT_AS_JFLAP'
          },
          {
            label: 'Export as URL/Raw data...',
            action: 'ENCODE_FILE'
          }
        ]
      },
      'hr',
      {
        label: 'Preferences',
        action: 'OPEN_PREFERENCES'
      }
    ]
  },
  {
    label: 'Edit',
    items: [
      {
        label: 'Undo',
        action: 'UNDO'
      },
      {
        label: 'Redo',
        action: 'REDO'
      },
      'hr',
      {
        label: 'Copy',
        action: 'COPY'
      },
      {
        label: 'Paste',
        action: 'PASTE'
      },
      {
        label: 'Select All',
        action: 'SELECT_ALL'
      },
      {
        label: 'Clear Selection',
        action: 'SELECT_NONE'
      },
      'hr',
      {
        label: 'Delete',
        shortcut: '⌫',
        action: 'DELETE'
      }
    ]
  },
  {
    label: 'View',
    items: [
      {
        label: 'Zoom in',
        action: 'ZOOM_IN'
      },
      {
        label: 'Zoom out',
        action: 'ZOOM_OUT'
      },
      {
        label: 'Zoom to 100%',
        action: 'ZOOM_100'
      },
      {
        label: 'Zoom to fit',
        action: 'ZOOM_FIT'
      },
      'hr',
      {
        label: 'Fullscreen',
        shortcut: 'F11',
        action: 'FULLSCREEN'
      },
      'hr',
      {
        label: 'Testing lab',
        action: 'TESTING_LAB'
      },
      /*
      {
        label: 'Stepping lab',
        action: 'STEPPING_LAB'
      },
      */
      {
        label: 'File info',
        action: 'FILE_INFO'
      },
      {
        label: 'File options',
        action: 'FILE_OPTIONS'
      },
      {
        label: 'Templates',
        action: 'TEMPLATES'
      },
      {
        label: 'Modules',
        action: 'MODULES'
      }
    ]
  },
  {
    label: 'Tools',
    items: [
      {
        label: 'Convert to DFA',
        action: 'CONVERT_TO_DFA'
      },
      'hr',
      {
        label: 'Auto layout',
        action: 'AUTO_LAYOUT'
      },
      {
        label: 'Reorder graph',
        action: 'REORDER_GRAPH'
      }
    ]
  },
  {
    label: 'Help',
    items: [
      {
        label: 'View documentation',
        action: 'OPEN_DOCS'
      },
      {
        label: 'Tutorial videos',
        action: 'TUTORIAL_VIDEOS'
      },
      {
        label: 'Keyboard shortcuts',
        action: 'KEYBOARD_SHORTCUTS'
      },
      'hr',
      {
        label: 'Privacy policy',
        action: 'PRIVACY_POLICY'
      },
      {
        label: 'About Automatarium',
        action: 'OPEN_ABOUT'
      },
      'hr',
      {
        label: `Version ${APP_VERSION}`
      }
    ]
  }
]

export default menus
