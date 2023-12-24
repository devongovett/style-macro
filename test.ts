import {style} from './style-macro.ts' with {type: 'macro'};

const focusRing = style({
  // outlineStyle: {
  //   default: 'none',
  //   isFocusVisible: 'solid'
  // },
  outlineColor: {
    default: 'blue-600',
    forcedColors: 'Highlight'
  },
  // outlineWidth: 2,
  // outlineOffset: 2
});

console.log(style({
  // w: 5,
  // h: 5,
  // flexShrink: 0,
  // rounded: 'md',
  // display: 'flex',
  // items: 'center',
  // justify: 'center',
  // border: 2,
  // transition: 'all',
  background: {
    default: 'white',
    dark: 'zinc-900',
    isSelected: '--color'
  },
  borderColor: '--color',
  '--color': {
    default: 'gray-700',
    dark: 'slate-300',
    forcedColors: 'Highlight',
    isPressed: {
      default: 'gray-800',
      dark: 'slate-200',
    },
    isInvalid: {
      default: 'red-700',
      dark: 'red-600',
      forcedColors: 'Mark',
      isPressed: {
        default: 'red-800',
        dark: 'red-700'
      }
    },
    isDisabled: {
      default: 'gray-200',
      dark: 'zinc-700',
      forcedColors: 'GrayText'
    }
  }
})({isInvalid: true, isPressed: true, isDisabled: true}))
