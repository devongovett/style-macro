import {Checkbox as RACCheckbox, CheckboxProps, CheckboxRenderProps} from 'react-aria-components';
import {Check, Minus} from 'lucide-react';
import { style } from '../default-theme.ts' with {type: 'macro'};
import React from 'react';
import { merge } from '../style-macro.ts';

export function App() {
  return (
    <div className={style({display: 'flex', flexDirection: 'column', gap: 2})({})}>
      <Checkbox>Test</Checkbox>
      <Checkbox isInvalid>Test</Checkbox>
      <Checkbox isIndeterminate>Test</Checkbox>
      <Checkbox isDisabled>Test</Checkbox>
    </div>
  )
}

const focusRing = style({
  outlineStyle: {
    default: 'none',
    isFocusVisible: 'solid'
  },
  outlineColor: {
    default: 'blue-600',
    forcedColors: 'Highlight'
  },
  outlineWidth: 2,
  outlineOffset: 2
});

const box = merge(focusRing, style({
  width: 5,
  height: 5,
  borderRadius: 'md',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderStyle: 'solid',
  transition: 'default',
  backgroundColor: {
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
}));

const iconStyles = style({
  width: 4,
  height: 4,
  color: {
    default: 'white',
    dark: 'slate-900',
    forcedColors: 'HighlightText',
    isDisabled: {
      default: 'gray-400',
      dark: 'slate-600',
      forcedColors: 'GrayText'
    }
  }
});

function Checkbox(props: CheckboxProps) {
  return (
    <RACCheckbox 
      {...props}
      className={style({
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        color: {
          default: 'gray-800',
          dark: 'zinc-200',
          isDisabled: {
            default: 'gray-300',
            dark: 'zinc-600',
            forcedColors: 'GrayText'
          }
        },
        fontSize: 'sm'
      })}>
      {({isSelected, isIndeterminate, ...renderProps}) => (
        <>
          <div className={box({isSelected: isSelected || isIndeterminate, ...renderProps})}>
            {isIndeterminate
              ? <Minus aria-hidden className={iconStyles(renderProps)} />
              : isSelected
                ? <Check aria-hidden className={iconStyles(renderProps)} />
                : null
            }
          </div>
          {props.children}
        </>
      )}
    </RACCheckbox>
  );
}
