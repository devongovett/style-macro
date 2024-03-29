import {Checkbox as RACCheckbox, CheckboxProps, ButtonRenderProps, Button as RACButton, ButtonProps as RACButtonProps, DateValue, DateField as AriaDateField, DateInput as AriaDateInput, DateFieldProps, DateInputProps, DateSegment, Label, SearchFieldProps, SearchField as AriaSearchField, GroupProps, Group, InputProps, Input as RACInput, CheckboxRenderProps} from 'react-aria-components';
import {Check, Minus, SearchIcon, XIcon} from 'lucide-react';
import { style, baseColor } from '../spectrum-theme.ts' with {type: 'macro'};
import { raw } from '../style-macro.ts' with {type: 'macro'};
import { merge, mergeStyles } from '../runtime';
import type { CSSProp } from '../types.ts';

export function App() {
  return (
    <div className={style({display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start'})()}>
      {/* <div className={style({backgroundColor: 'red-700', padding: 2, paddingX: 8})()}>test</div>
      <div className={style({backgroundColor: 'red-700', paddingX: 8, padding: 2})()}>test</div>
      <div className={merge(style({backgroundColor: 'red-700', padding: 2}), style({paddingX: 8}))()}>test</div>
      <div className={merge(style({paddingX: 8}), style({backgroundColor: 'red-700', padding: 2}))()}>test</div> */}
      <Checkbox size="S">Test</Checkbox>
      <Checkbox size="M">Test</Checkbox>
      <Checkbox size="L">Test</Checkbox>
      <Checkbox size="XL">Test</Checkbox>
      <Checkbox isEmphasized>Test</Checkbox>
      <Checkbox isInvalid>Test</Checkbox>
      <Checkbox isIndeterminate>Test</Checkbox>
      <Checkbox isDisabled>Test</Checkbox>
      <Button variant="primary" style="fill">Test</Button>
      <Button variant="primary" style="fill"><Icon /> <ButtonLabel>Test</ButtonLabel></Button>
      <Button variant="primary" style="fill" isIconOnly><Icon /></Button>
      <Button variant="primary" style="fill" css={style({maxWidth: 32})()}>Very long button with wrapping text to see what happens</Button>
      <Button variant="primary" style="fill" css={style({maxWidth: 32})()}>
        <Icon />
        <ButtonLabel>Very long button with wrapping text to see what happens</ButtonLabel>
      </Button>
      <Button variant="secondary" style="fill">Test</Button>
      <Button variant="accent" style="fill">Test</Button>
      <Button variant="negative" style="fill">Test</Button>
      <Button variant="primary" style="fill" isDisabled>Test</Button>
      <Button variant="primary" style="outline">Test</Button>
      <Button variant="primary" style="outline"><Icon /> <ButtonLabel>Test</ButtonLabel></Button>
      <Button variant="secondary" style="outline">Test</Button>
      <Button variant="accent" style="outline">Test</Button>
      <Button variant="negative" style="outline">Test</Button>
      <Button variant="primary" style="outline" isDisabled>Test</Button>
      <Button variant="primary" style="fill" size="S"><Icon /> <ButtonLabel>Test</ButtonLabel></Button>
      <Button variant="primary" style="fill" size="M"><Icon /> <ButtonLabel>Test</ButtonLabel></Button>
      <Button variant="primary" style="fill" size="L"><Icon /> <ButtonLabel>Test</ButtonLabel></Button>
      <Button variant="primary" style="fill" size="XL"><Icon /> <ButtonLabel>Test</ButtonLabel></Button>
      <div className={style({padding: 2, backgroundColor: {default: 'blue-800', dark: 'blue-500'}, display: 'flex', flexDirection: 'column', gap: 2})()}>
        <Button variant="primary" style="fill" staticColor="white">Test</Button>
        <Button variant="primary" style="fill" staticColor="white" isDisabled>Test</Button>
        <Button variant="secondary" style="fill" staticColor="white">Test</Button>
        <Button variant="secondary" style="fill" staticColor="white" isDisabled>Test</Button>
        <Button variant="primary" style="outline" staticColor="white">Test</Button>
        <Button variant="primary" style="outline" staticColor="white" isDisabled>Test</Button>
        <Button variant="secondary" style="outline" staticColor="white">Test</Button>
        <Button variant="secondary" style="outline" staticColor="white" isDisabled>Test</Button>
      </div>
      <div className={style({padding: 2, backgroundColor: {default: 'yellow-400', dark: 'yellow-1100'}, display: 'flex', flexDirection: 'column', gap: 2})()}>
        <Button variant="primary" style="fill" staticColor="black">Test</Button>
        <Button variant="primary" style="fill" staticColor="black" isDisabled>Test</Button>
        <Button variant="secondary" style="fill" staticColor="black">Test</Button>
        <Button variant="secondary" style="fill" staticColor="black" isDisabled>Test</Button>
        <Button variant="primary" style="outline" staticColor="black">Test</Button>
        <Button variant="primary" style="outline" staticColor="black" isDisabled>Test</Button>
        <Button variant="secondary" style="outline" staticColor="black">Test</Button>
        <Button variant="secondary" style="outline" staticColor="black" isDisabled>Test</Button>
      </div>
      <ActionButton size="XS"><Icon /> <ButtonLabel>Test</ButtonLabel></ActionButton>
      <ActionButton size="S"><Icon /> <ButtonLabel>Test</ButtonLabel></ActionButton>
      <ActionButton size="M"><Icon /> <ButtonLabel>Test</ButtonLabel></ActionButton>
      <ActionButton size="L"><Icon /> <ButtonLabel>Test</ButtonLabel></ActionButton>
      <ActionButton size="XL"><Icon /> <ButtonLabel>Test</ButtonLabel></ActionButton>
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
  outlineColor: 'focus-ring',
  outlineWidth: 2,
  outlineOffset: 2
});

interface CheckboxStyleProps {
  size?: 'S' | 'M' | 'L' | 'XL',
  isEmphasized?: boolean
}

const box = merge<CheckboxRenderProps & CheckboxStyleProps>(focusRing, style({
  size: 'control-sm',
  borderRadius: 'control-sm',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  boxSizing: 'border-box',
  borderStyle: 'solid',
  transition: 'default',
  willChange: 'transform',
  transform: {
    isPressed: 'perspective(max(self(height), 24px)) translateZ(-2px)'
  },
  backgroundColor: {
    default: 'gray-25',
    isSelected: {
      default: 'neutral',
      isEmphasized: baseColor('accent-900'),
      forcedColors: 'Highlight',
      isInvalid: {
        default: baseColor('negative-900'),
        forcedColors: 'Mark'
      },
      isDisabled: {
        default: 'disabled',
        forcedColors: 'GrayText'
      }
    }
  },
  borderColor: {
    default: baseColor('gray-800'),
    forcedColors: 'ButtonBorder',
    isInvalid: {
      default: 'negative',
      forcedColors: 'Mark'
    },
    isDisabled: {
      default: 'disabled',
      forcedColors: 'GrayText'
    },
    isSelected: 'transparent'
  }
}));

const iconStyles = style({
  size: {
    default: 2.5,
    size: {
      XL: 3
    }
  },
  color: {
    default: 'gray-25',
    forcedColors: 'HighlightText',
    isDisabled: {
      default: 'gray-400',
      forcedColors: 'GrayText'
    }
  }
});

function Checkbox(props: CheckboxProps & CheckboxStyleProps) {
  return (
    <RACCheckbox
      {...props}
      className={renderProps => style<CheckboxRenderProps & CheckboxStyleProps>({
        display: 'flex',
        columnGap: 'text-to-control',
        alignItems: 'center',
        // height: 'control',
        fontSize: 'control',
        transition: 'colors',
        color: {
          default: 'neutral',
          isDisabled: {
            default: 'disabled',
            forcedColors: 'GrayText'
          }
        }
      })({...renderProps, size: props.size || 'M'})}>
      {({isSelected, isIndeterminate, ...renderProps}) => (
        <>
          <div className={box({isSelected: isSelected || isIndeterminate, isIndeterminate, size: props.size || 'M', isEmphasized: props.isEmphasized, ...renderProps})}>
            {isIndeterminate
              ? <Minus aria-hidden className={iconStyles(renderProps)} />
              : isSelected
                ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" fill="none" className={iconStyles({...renderProps, size: props.size || 'M'})}>
                    <g clipPath="url(#clip0_18897_553)">
                    <path d="M3.66706 9.07424C3.38239 9.07424 3.11237 8.94826 2.92976 8.72854L0.752512 6.11623C0.413152 5.709 0.467842 5.10353 0.875072 4.76467C1.28327 4.42678 1.88777 4.47951 2.22712 4.88772L3.64509 6.58889L7.75691 1.35549C8.08552 0.937519 8.68757 0.868189 9.10505 1.19338C9.52155 1.52053 9.59431 2.12404 9.26667 2.54104L4.42194 8.70706C4.24274 8.93558 3.97077 9.07034 3.68073 9.07425L3.66706 9.07424Z" fill="currentColor"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_18897_553">
                    <rect width="10" height="10" fill="currentColor"/>
                    </clipPath>
                    </defs>
                    </svg>
                : null
            }
          </div>
          {props.children}
        </>
      )}
    </RACCheckbox>
  );
}

interface ButtonStyleProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'negative',
  style?: 'fill' | 'outline',
  size?: 'S' | 'M' | 'L' | 'XL',
  staticColor?: 'white' | 'black',
  isIconOnly?: boolean
}

interface ButtonProps extends Omit<RACButtonProps, 'style'>, ButtonStyleProps {}

const button = merge(focusRing, style<ButtonRenderProps & ButtonStyleProps>({
  display: 'flex',
  alignItems: {
    default: 'baseline',
    isIconOnly: 'center'
  },
  justifyContent: 'center',
  textAlign: 'start',
  columnGap: 'text-to-visual',
  fontSize: 'control',
  minHeight: 'control',
  borderRadius: 'pill',
  paddingX: {
    default: 'pill',
    isIconOnly: 0
  },
  paddingY: 0,
  aspectRatio: {
    isIconOnly: 'square'
  },
  transition: 'default',
  transform: {
    isPressed: 'perspective(max(self(minHeight), 24px)) translateZ(-2px)'
  },
  borderStyle: 'solid',
  borderWidth: {
    style: {
      fill: 0,
      outline: 2
    }
  },
  '--labelPadding': {
    type: 'paddingTop',
    value: '[calc((self(minHeight) - 1lh) / 2 - self(borderWidth))]'
  },
  borderColor: {
    variant: {
      primary: baseColor('gray-800'),
      secondary: baseColor('gray-300')
    },
    isDisabled: 'disabled',
    staticColor: {
      white: {
        variant: {
          primary: baseColor('transparent-white-800'),
          secondary: baseColor('transparent-white-300')
        },
        isDisabled: 'transparent-white-300'
      },
      black: {
        variant: {
          primary: baseColor('transparent-black-800'),
          secondary: baseColor('transparent-black-300')
        },
        isDisabled: 'transparent-black-300'
      }
    },
    forcedColors: {
      default: 'ButtonBorder',
      isHovered: 'Highlight',
      isDisabled: 'GrayText'
    }
  },
  fontWeight: 'bold',
  backgroundColor: {
    style: {
      fill: {
        variant: {
          primary: 'neutral',
          secondary: baseColor('gray-100'),
          accent: 'accent',
          negative: 'negative'
        },
        isDisabled: 'disabled'
      },
      outline: {
        default: 'transparent',
        isHovered: 'gray-100',
        isPressed: 'gray-100',
      }
    },
    staticColor: {
      white: {
        style: {
          fill: {
            variant: {
              primary: baseColor('transparent-white-800'),
              secondary: baseColor('transparent-white-100')
            },
            isDisabled: 'transparent-white-100'
          },
          outline: {
            default: 'transparent',
            isHovered: 'transparent-white-100',
            isPressed: 'transparent-white-100'
          }
        }
      },
      black: {
        style: {
          fill: {
            variant: {
              primary: baseColor('transparent-black-800'),
              secondary: baseColor('transparent-black-100')
            },
            isDisabled: 'transparent-black-100'
          },
          outline: {
            default: 'transparent',
            isHovered: 'transparent-black-100',
            isPressed: 'transparent-black-100'
          }
        }
      }
    },
    forcedColors: {
      style: {
        fill: {
          default: 'ButtonText',
          isHovered: 'Highlight',
          isDisabled: 'GrayText'
        },
        outline: 'ButtonFace'
      }
    }
  },
  color: {
    style: {
      fill: {
        variant: {
          primary: 'gray-25',
          secondary: 'neutral',
          accent: 'white',
          negative: 'white'
        },
        isDisabled: 'disabled'
      },
      outline: 'neutral'
    },
    staticColor: {
      white: {
        style: {
          fill: {
            variant: {
              primary: 'black',
              secondary: baseColor('transparent-white-800')
            }
          },
          outline: baseColor('transparent-white-800'),
        },
        isDisabled: 'transparent-white-400'
      },
      black: {
        style: {
          fill: {
            variant: {
              primary: 'white',
              secondary: baseColor('transparent-black-800'),
            }
          },
          outline: baseColor('transparent-black-800'),
        },
        isDisabled: 'transparent-black-400'
      }
    },
    forcedColors: {
      style: {
        fill: {
          default: 'ButtonFace',
          isDisabled: 'HighlightText'
        },
        outline: {
          default: 'ButtonText',
          isDisabled: 'GrayText'
        }
      },
    }
  },
  outlineColor: {
    staticColor: {
      white: 'white',
      black: 'black'
    },
    forcedColors: 'Highlight'
  },
  forcedColorAdjust: 'none'
}));

type AllowedStyleProps = 'margin' | 'marginStart' | 'marginEnd' | 'visibility';
interface MyButtonProps extends Omit<ButtonProps, 'className'> {
  css?: CSSProp<typeof style, AllowedStyleProps>
}

function Button(props: MyButtonProps) {
  return (
    <RACButton
      {...props}
      style={undefined}
      className={renderProps => mergeStyles(props.css, button({...renderProps, variant: props.variant || 'primary', style: props.style || 'fill', size: props.size || 'M', staticColor: props.staticColor, isIconOnly: props.isIconOnly}))}>
      {typeof props.children === 'string' ? <ButtonLabel>{props.children}</ButtonLabel> : props.children}
    </RACButton>
  );
}

function ButtonLabel({children}) {
  return <span className={style({paddingY: '--labelPadding'})()}>{children}</span>
}

function ActionButton(props: RACButtonProps & {size: 'XS' | 'S' | 'M' | 'L' | 'XL'}) {
  return (
    <RACButton
      {...props}
      className={renderProps => merge(focusRing, style({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 'text-to-visual',
        fontSize: 'control',
        height: 'control',
        transform: {
          isPressed: 'perspective(max(self(height), 24px)) translateZ(-2px)'
        },
        transition: 'default',
        backgroundColor: baseColor('gray-100'),
        color: 'neutral',
        borderStyle: 'none',
        paddingX: 'edge-to-text',
        paddingY: 0,
        borderRadius: 'control'
      }))({...renderProps, size: props.size})} />
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
    // dark: {
    //   default: 'zinc-500',
    //   isFocusWithin: 'zinc-300',
    //   isInvalid: 'red-600'
    // },
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
    default: 'gray-50',
    // dark: 'zinc-900',
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
      <Label className={style({fontSize: 'base'})()}>Test</Label>
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
        fontSize: 'base'
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
              // dark: 'zinc-200',
              forcedColors: 'ButtonText',
              isPlaceholder: {
                default: 'gray-600',
                // dark: 'zinc-400'
              },
              isFocused: {
                default: 'white',
                forcedColors: 'HighlightText'
              },
              isDisabled: {
                default: 'gray-200',
                // dark: 'zinc-600',
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
        <Label className={style({fontSize: 'base'})()}>Test</Label>
        <FieldGroup>
          <SearchIcon aria-hidden className={style({width: 4, height: 4, marginStart: 2, color: {default: 'gray-500', forcedColors: 'ButtonText'}})()} />
          <Input className={raw('&::-webkit-search-cancel-button { display: none }')} />
          <Button variant="icon" css={style({marginEnd: 1, visibility: {isEmpty: 'hidden'}})({isEmpty})}>
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
          default: 'gray-50',
          // dark: 'zinc-900',
        },
        fontSize: 'base',
        color: {
          default: 'gray-800',
          // dark: 'zinc-200',
          isDisabled: {
            default: 'gray-200',
            // dark: 'zinc-700'
          }
        },
        borderStyle: 'none'
      })(r)} />
  );
}

function Icon() {
  return <div className={style({display: 'flex', alignItems: 'center', marginStart: '[calc(-2 / 14 * 1em)]'})() + ' ' + raw('&::before { content: "\u00a0"; width: 0; visibility: hidden } &:only-child { margin-inline-start: 0 }')}>
    <svg viewBox="0 0 20 20" fill="none" className={style({
      // width: '[round(calc(20 / 14 * 1em), 2px)]',
      // height: '[round(calc(20 / 14 * 1em), 2px)]',
      width: '[calc(20 / 14 * 1em)]',
      height: '[calc(20 / 14 * 1em)]',
      flexShrink: 0
    })()}>
    <path d="M18 4.25V15.75C18 16.9907 16.9907 18 15.75 18H4.25C3.00928 18 2 16.9907 2 15.75V4.25C2 3.00928 3.00928 2 4.25 2H15.75C16.9907 2 18 3.00928 18 4.25ZM16.5 4.25C16.5 3.83643 16.1636 3.5 15.75 3.5H4.25C3.83643 3.5 3.5 3.83643 3.5 4.25V15.75C3.5 16.1636 3.83643 16.5 4.25 16.5H15.75C16.1636 16.5 16.5 16.1636 16.5 15.75V4.25Z" fill="currentColor"/>
    <path d="M13.7632 10C13.7632 10.4214 13.4214 10.7632 13 10.7632H10.7632V13C10.7632 13.4214 10.4214 13.7632 10 13.7632C9.57862 13.7632 9.23682 13.4214 9.23682 13V10.7632H7C6.57861 10.7632 6.23682 10.4214 6.23682 10C6.23682 9.57862 6.57862 9.23682 7 9.23682H9.23682V7C9.23682 6.57861 9.57862 6.23682 10 6.23682C10.4214 6.23682 10.7632 6.57862 10.7632 7V9.23682H13C13.4214 9.23682 13.7632 9.57862 13.7632 10Z" fill="currentColor"/>
    </svg>
  </div>
};
