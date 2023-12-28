import {Checkbox as RACCheckbox, CheckboxProps, ButtonRenderProps, Button as RACButton, ButtonProps as RACButtonProps, DateValue, DateField as AriaDateField, DateInput as AriaDateInput, DateFieldProps, DateInputProps, DateSegment, Label} from 'react-aria-components';
import {Check, Minus} from 'lucide-react';
import { style } from '../default-theme.ts' with {type: 'macro'};
import React from 'react';
import { merge } from '../style-macro.ts';

export function App() {
  return (
    <div className={style({display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start'})({})}>
      <Checkbox>Test</Checkbox>
      <Checkbox isInvalid>Test</Checkbox>
      <Checkbox isIndeterminate>Test</Checkbox>
      <Checkbox isDisabled>Test</Checkbox>
      <Button variant="primary">Test</Button>
      <Button variant="secondary">Test</Button>
      <Button variant="destructive">Test</Button>
      <Button variant="primary" isDisabled>Test</Button>
      <DateField />
    </div>
  );
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

interface ButtonProps extends RACButtonProps {
  variant: 'primary' | 'secondary' | 'destructive' | 'icon'
}

const button = merge(focusRing, style<ButtonRenderProps & {variant: 'primary' | 'secondary' | 'destructive' | 'icon'}>({
  paddingX: 5,
  paddingY: 2,
  fontSize: 'sm',
  textAlign: 'center',
  transition: 'default',
  borderRadius: 'lg',
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: {
    default: 'black',
    dark: 'white'
  },
  borderOpacity: {
    default: 0.1,
    isDisabled: 0.05
  },
  boxShadow: {
    default: '[inset 0 1px 0 0 rgba(255, 255, 255, 0.1)]',
    dark: 'none'
  },
  backgroundColor: {
    variant: {
      primary: {
        default: 'blue-600',
        isHovered: 'blue-700',
        isPressed: 'blue-800'
      },
      secondary: {
        default: {
          default: 'gray-100',
          isHovered: 'gray-200',
          isPressed: 'gray-300'
        },
        dark: {
          default: 'zinc-600',
          isHovered: 'zinc-500',
          isPressed: 'zinc-400'
        }
      },
      destructive: {
        default: 'red-700',
        isHovered: 'red-800',
        isPressed: 'red-900'
      },
      // icon: {
      //   isHovered: 'bg-white/10' dpofjdpofj dpfojdpfoj
      // }
    },
    isDisabled: {
      default: 'gray-100',
      dark: 'zinc-800'
    }
  },
  color: {
    variant: {
      primary: 'white',
      secondary: {
        default: 'gray-800',
        dark: 'zinc-100'
      },
      destructive: 'white',
      icon: 'gray-600'
    },
    isDisabled: 'GrayText'
  }
}));

function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={renderProps => button({...renderProps, variant: props.variant})} />
  );
}

const fieldBorderStyles = style({
  borderColor: {
    // default: 'gray-300',
    // dark: 'zinc-500',
    // forcedColors: 'ButtonBorder',
    // isFocusWithin: {
    //   default: 'gray-600',
    //   dark: 'zinc-300',
    //   forcedColors: 'Highlight'
    // },
    // isInvalid: {
    //   default: 'red-600',
    //   dark: 'red-600',
    //   forcedColors: 'Mark'
    // },
    // isDisabled: {
    //   default: 'gray-200',
    //   dark: 'zinc-700',
    //   forcedColors: 'GrayText'
    // }
    default: {
      default: 'gray-300',
      isFocusWithin: 'gray-600',
      isInvalid: 'red-600',
      isDisabled: 'gray-200'
    },
    dark: {
      default: 'zinc-500',
      isFocusWithin: 'zinc-300',
      isInvalid: 'red-600'
    },
    forcedColors: {
      default: 'ButtonBorder',
      isFocusWithin: 'Highlight',
      isInvalid: 'Mark',
      isDisabled: 'GrayText'
    }
  }
});

const fieldGroupStyles = merge(focusRing, fieldBorderStyles, style({
  // display: 'flex',
  // alignItems: 'center',
  height: 9,
  backgroundColor: {
    default: 'white',
    dark: 'zinc-900',
    forcedColors: 'Field'
  },
  borderWidth: 2,
  borderStyle: 'solid',
  borderRadius: 'lg',
  overflow: 'hidden',

  display: 'block',
  // minWidth: 150,
  paddingX: 2,
  paddingY: 1.5,
  fontSize: 'sm'
}));

function DateField<T extends DateValue>(props: DateFieldProps<T>) {
  return (
    <AriaDateField {...props} className="flex flex-col gap-1">
      <Label>Test</Label>
      <DateInput />
    </AriaDateField>
  );
}

function DateInput(props: Omit<DateInputProps, 'children'>) {
  return (
    <AriaDateInput className={fieldGroupStyles} {...props}>
      {(segment) => (
        <DateSegment
          segment={segment}
          className={style({
            display: 'inline',
            padding: {
              default: 0.5,
              type: {
                literal: 0
              }
            },
            borderRadius: 'default',
            outlineStyle: 'none',
            forcedColorAdjust: 'none',
            caretColor: 'transparent',
            fontStyle: {
              isPlaceholder: 'italic'
            },
            backgroundColor: {
              isFocused: {
                default: 'blue-600',
                forcedColors: 'Highlight'
              }
            },
            color: {
              default: 'gray-800',
              dark: 'zinc-200',
              forcedColors: 'ButtonText',
              isPlaceholder: {
                default: 'gray-600',
                dark: 'zinc-400'
              },
              isFocused: {
                default: 'white',
                forcedColors: 'HighlightText'
              },
              isDisabled: {
                default: 'gray-200',
                dark: 'zinc-600',
                forcedColors: 'GrayText'
              }
            }
          })} />
      )}
    </AriaDateInput>
  );
}
