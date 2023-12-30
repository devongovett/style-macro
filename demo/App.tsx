import {Checkbox as RACCheckbox, CheckboxProps, ButtonRenderProps, Button as RACButton, ButtonProps as RACButtonProps, DateValue, DateField as AriaDateField, DateInput as AriaDateInput, DateFieldProps, DateInputProps, DateSegment, Label, SearchFieldProps, SearchField as AriaSearchField, GroupProps, Group, InputProps, Input as RACInput} from 'react-aria-components';
import {Check, Minus, SearchIcon, XIcon} from 'lucide-react';
import { style } from '../default-theme.ts' with {type: 'macro'};
import { raw } from '../style-macro.ts' with {type: 'macro'};
import { merge } from '../style-macro.ts';

export function App() {
  return (
    <div className={style({display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start'})()}>
      <Checkbox>Test</Checkbox>
      <Checkbox isInvalid>Test</Checkbox>
      <Checkbox isIndeterminate>Test</Checkbox>
      <Checkbox isDisabled>Test</Checkbox>
      <Button variant="primary">Test</Button>
      <Button variant="secondary">Test</Button>
      <Button variant="destructive">Test</Button>
      <Button variant="primary" isDisabled>Test</Button>
      <DateField />
      <SearchField />
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
    type: 'color',
    value: {
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingX: {
    default: 5,
    variant: {
      icon: 1
    }
  },
  paddingY: {
    default: 2,
    variant: {
      icon: 1
    }
  },
  fontSize: 'sm',
  textAlign: 'center',
  transition: 'default',
  borderRadius: 'lg',
  borderStyle: {
    default: 'solid',
    variant: {
      icon: 'none'
    }
  },
  borderWidth: 1,
  borderColor: {
    default: 'black/10',
    dark: 'white/10',
    isDisabled: {
      default: 'black/5',
      dark: 'white/5'
    }
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
      icon: {
        default: {
          default: 'transparent',
          isHovered: 'black/5',
          isPressed: 'black/10'
        },
        dark: {
          default: 'transparent',
          isHovered: 'white/5',
          isPressed: 'white/10'
        }
      }
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
      icon: {
        default: 'gray-600',
        dark: 'zinc-400'
      }
    },
    isDisabled: 'GrayText'
  }
}));

function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={merge(props.className, renderProps => button({...renderProps, variant: props.variant}))} />
  );
}

const fieldBorderStyles = style({
  borderColor: {
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
  display: 'flex',
  alignItems: 'center',
  backgroundColor: {
    default: 'white',
    dark: 'zinc-900',
    forcedColors: 'Field'
  },
  borderWidth: 2,
  borderStyle: 'solid',
  borderRadius: 'lg',
  overflow: 'hidden'
}));

function DateField<T extends DateValue>(props: DateFieldProps<T>) {
  return (
    <AriaDateField {...props} className={style({display: 'flex', flexDirection: 'column', gap: 1})}>
      <Label className={style({fontSize: 'sm'})()}>Test</Label>
      <DateInput />
    </AriaDateField>
  );
}

function DateInput(props: Omit<DateInputProps, 'children'>) {
  return (
    <AriaDateInput
      {...props}
      className={merge(fieldGroupStyles, style({
        display: 'block',
        minWidth: 40,
        paddingX: 2,
        paddingY: 1.5,
        fontSize: 'sm'
      }))}>
      {(segment) => (
        <DateSegment
          segment={segment}
          className={style({
            display: 'inline',
            borderRadius: 'default',
            outlineStyle: 'none',
            forcedColorAdjust: 'none',
            caretColor: 'transparent',
            padding: {
              default: 0.5,
              type: {
                literal: 0
              }
            },
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

function FieldGroup(props: GroupProps) {
  return <Group {...props} className={fieldGroupStyles} />;
}

function SearchField(props: SearchFieldProps) {
  return (
    <AriaSearchField {...props} className={style({display: 'flex', flexDirection: 'column', gap: 1})}>
      {({isEmpty}) => <>
        <Label className={style({fontSize: 'sm'})()}>Test</Label>
        <FieldGroup>
          <SearchIcon aria-hidden className={style({width: 4, height: 4, marginStart: 2, color: {default: 'gray-500', dark: 'zinc-400', forcedColors: 'ButtonText'}})()} />
          <Input className={raw('&::-webkit-search-cancel-button { display: none }')} />
          <Button variant="icon" className={() => style({marginEnd: 1, visibility: {isEmpty: 'hidden'}})({isEmpty})}>
            <XIcon aria-hidden className={style({width: 4, height: 4})()} />
          </Button>
        </FieldGroup>
      </>}
    </AriaSearchField>
  );
}

function Input(props: InputProps) {
  return (
    <RACInput
      {...props}
      className={r => props.className + style({
        paddingX: 2,
        paddingY: 1.5,
        flex: 1,
        minWidth: 0,
        outlineStyle: 'none',
        backgroundColor: {
          default: 'white',
          dark: 'zinc-900',
        },
        fontSize: 'sm',
        color: {
          default: 'gray-800',
          dark: 'zinc-200',
          isDisabled: {
            default: 'gray-200',
            dark: 'zinc-700'
          }
        },
        borderStyle: 'none'
      })(r)} />
  );
}
