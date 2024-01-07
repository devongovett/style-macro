import tailwindColors from 'tailwindcss/colors';
import { createColorProperty, createMappedProperty, createTheme, createArbitraryProperty } from './style-macro.ts';
import type * as CSS from 'csstype';

const color = {
  transparent: 'transparent',
  black: 'black',
  white: 'white',
  'slate-50': tailwindColors.slate['50'],
  'slate-100': tailwindColors.slate['100'],
  'slate-200': tailwindColors.slate['200'],
  'slate-300': tailwindColors.slate['300'],
  'slate-400': tailwindColors.slate['400'],
  'slate-500': tailwindColors.slate['500'],
  'slate-600': tailwindColors.slate['600'],
  'slate-700': tailwindColors.slate['700'],
  'slate-800': tailwindColors.slate['800'],
  'slate-900': tailwindColors.slate['900'],
  'gray-50': tailwindColors.gray['50'],
  'gray-100': tailwindColors.gray['100'],
  'gray-200': tailwindColors.gray['200'],
  'gray-300': tailwindColors.gray['300'],
  'gray-400': tailwindColors.gray['400'],
  'gray-500': tailwindColors.gray['500'],
  'gray-600': tailwindColors.gray['600'],
  'gray-700': tailwindColors.gray['700'],
  'gray-800': tailwindColors.gray['800'],
  'gray-900': tailwindColors.gray['900'],
  'zinc-50': tailwindColors.zinc['50'],
  'zinc-100': tailwindColors.zinc['100'],
  'zinc-200': tailwindColors.zinc['200'],
  'zinc-300': tailwindColors.zinc['300'],
  'zinc-400': tailwindColors.zinc['400'],
  'zinc-500': tailwindColors.zinc['500'],
  'zinc-600': tailwindColors.zinc['600'],
  'zinc-700': tailwindColors.zinc['700'],
  'zinc-800': tailwindColors.zinc['800'],
  'zinc-900': tailwindColors.zinc['900'],
  'neutral-50': tailwindColors.neutral['50'],
  'neutral-100': tailwindColors.neutral['100'],
  'neutral-200': tailwindColors.neutral['200'],
  'neutral-300': tailwindColors.neutral['300'],
  'neutral-400': tailwindColors.neutral['400'],
  'neutral-500': tailwindColors.neutral['500'],
  'neutral-600': tailwindColors.neutral['600'],
  'neutral-700': tailwindColors.neutral['700'],
  'neutral-800': tailwindColors.neutral['800'],
  'neutral-900': tailwindColors.neutral['900'],
  'stone-50': tailwindColors.stone['50'],
  'stone-100': tailwindColors.stone['100'],
  'stone-200': tailwindColors.stone['200'],
  'stone-300': tailwindColors.stone['300'],
  'stone-400': tailwindColors.stone['400'],
  'stone-500': tailwindColors.stone['500'],
  'stone-600': tailwindColors.stone['600'],
  'stone-700': tailwindColors.stone['700'],
  'stone-800': tailwindColors.stone['800'],
  'stone-900': tailwindColors.stone['900'],
  'red-50': tailwindColors.red['50'],
  'red-100': tailwindColors.red['100'],
  'red-200': tailwindColors.red['200'],
  'red-300': tailwindColors.red['300'],
  'red-400': tailwindColors.red['400'],
  'red-500': tailwindColors.red['500'],
  'red-600': tailwindColors.red['600'],
  'red-700': tailwindColors.red['700'],
  'red-800': tailwindColors.red['800'],
  'red-900': tailwindColors.red['900'],
  'orange-50': tailwindColors.orange['50'],
  'orange-100': tailwindColors.orange['100'],
  'orange-200': tailwindColors.orange['200'],
  'orange-300': tailwindColors.orange['300'],
  'orange-400': tailwindColors.orange['400'],
  'orange-500': tailwindColors.orange['500'],
  'orange-600': tailwindColors.orange['600'],
  'orange-700': tailwindColors.orange['700'],
  'orange-800': tailwindColors.orange['800'],
  'orange-900': tailwindColors.orange['900'],
  'amber-50': tailwindColors.amber['50'],
  'amber-100': tailwindColors.amber['100'],
  'amber-200': tailwindColors.amber['200'],
  'amber-300': tailwindColors.amber['300'],
  'amber-400': tailwindColors.amber['400'],
  'amber-500': tailwindColors.amber['500'],
  'amber-600': tailwindColors.amber['600'],
  'amber-700': tailwindColors.amber['700'],
  'amber-800': tailwindColors.amber['800'],
  'amber-900': tailwindColors.amber['900'],
  'yellow-50': tailwindColors.yellow['50'],
  'yellow-100': tailwindColors.yellow['100'],
  'yellow-200': tailwindColors.yellow['200'],
  'yellow-300': tailwindColors.yellow['300'],
  'yellow-400': tailwindColors.yellow['400'],
  'yellow-500': tailwindColors.yellow['500'],
  'yellow-600': tailwindColors.yellow['600'],
  'yellow-700': tailwindColors.yellow['700'],
  'yellow-800': tailwindColors.yellow['800'],
  'yellow-900': tailwindColors.yellow['900'],
  'lime-50': tailwindColors.lime['50'],
  'lime-100': tailwindColors.lime['100'],
  'lime-200': tailwindColors.lime['200'],
  'lime-300': tailwindColors.lime['300'],
  'lime-400': tailwindColors.lime['400'],
  'lime-500': tailwindColors.lime['500'],
  'lime-600': tailwindColors.lime['600'],
  'lime-700': tailwindColors.lime['700'],
  'lime-800': tailwindColors.lime['800'],
  'lime-900': tailwindColors.lime['900'],
  'green-50': tailwindColors.green['50'],
  'green-100': tailwindColors.green['100'],
  'green-200': tailwindColors.green['200'],
  'green-300': tailwindColors.green['300'],
  'green-400': tailwindColors.green['400'],
  'green-500': tailwindColors.green['500'],
  'green-600': tailwindColors.green['600'],
  'green-700': tailwindColors.green['700'],
  'green-800': tailwindColors.green['800'],
  'green-900': tailwindColors.green['900'],
  'emerald-50': tailwindColors.emerald['50'],
  'emerald-100': tailwindColors.emerald['100'],
  'emerald-200': tailwindColors.emerald['200'],
  'emerald-300': tailwindColors.emerald['300'],
  'emerald-400': tailwindColors.emerald['400'],
  'emerald-500': tailwindColors.emerald['500'],
  'emerald-600': tailwindColors.emerald['600'],
  'emerald-700': tailwindColors.emerald['700'],
  'emerald-800': tailwindColors.emerald['800'],
  'emerald-900': tailwindColors.emerald['900'],
  'teal-50': tailwindColors.teal['50'],
  'teal-100': tailwindColors.teal['100'],
  'teal-200': tailwindColors.teal['200'],
  'teal-300': tailwindColors.teal['300'],
  'teal-400': tailwindColors.teal['400'],
  'teal-500': tailwindColors.teal['500'],
  'teal-600': tailwindColors.teal['600'],
  'teal-700': tailwindColors.teal['700'],
  'teal-800': tailwindColors.teal['800'],
  'teal-900': tailwindColors.teal['900'],
  'cyan-50': tailwindColors.cyan['50'],
  'cyan-100': tailwindColors.cyan['100'],
  'cyan-200': tailwindColors.cyan['200'],
  'cyan-300': tailwindColors.cyan['300'],
  'cyan-400': tailwindColors.cyan['400'],
  'cyan-500': tailwindColors.cyan['500'],
  'cyan-600': tailwindColors.cyan['600'],
  'cyan-700': tailwindColors.cyan['700'],
  'cyan-800': tailwindColors.cyan['800'],
  'cyan-900': tailwindColors.cyan['900'],
  'sky-50': tailwindColors.sky['50'],
  'sky-100': tailwindColors.sky['100'],
  'sky-200': tailwindColors.sky['200'],
  'sky-300': tailwindColors.sky['300'],
  'sky-400': tailwindColors.sky['400'],
  'sky-500': tailwindColors.sky['500'],
  'sky-600': tailwindColors.sky['600'],
  'sky-700': tailwindColors.sky['700'],
  'sky-800': tailwindColors.sky['800'],
  'sky-900': tailwindColors.sky['900'],
  'blue-50': tailwindColors.blue['50'],
  'blue-100': tailwindColors.blue['100'],
  'blue-200': tailwindColors.blue['200'],
  'blue-300': tailwindColors.blue['300'],
  'blue-400': tailwindColors.blue['400'],
  'blue-500': tailwindColors.blue['500'],
  'blue-600': tailwindColors.blue['600'],
  'blue-700': tailwindColors.blue['700'],
  'blue-800': tailwindColors.blue['800'],
  'blue-900': tailwindColors.blue['900'],
  'indigo-50': tailwindColors.indigo['50'],
  'indigo-100': tailwindColors.indigo['100'],
  'indigo-200': tailwindColors.indigo['200'],
  'indigo-300': tailwindColors.indigo['300'],
  'indigo-400': tailwindColors.indigo['400'],
  'indigo-500': tailwindColors.indigo['500'],
  'indigo-600': tailwindColors.indigo['600'],
  'indigo-700': tailwindColors.indigo['700'],
  'indigo-800': tailwindColors.indigo['800'],
  'indigo-900': tailwindColors.indigo['900'],
  'violet-50': tailwindColors.violet['50'],
  'violet-100': tailwindColors.violet['100'],
  'violet-200': tailwindColors.violet['200'],
  'violet-300': tailwindColors.violet['300'],
  'violet-400': tailwindColors.violet['400'],
  'violet-500': tailwindColors.violet['500'],
  'violet-600': tailwindColors.violet['600'],
  'violet-700': tailwindColors.violet['700'],
  'violet-800': tailwindColors.violet['800'],
  'violet-900': tailwindColors.violet['900'],
  'purple-50': tailwindColors.purple['50'],
  'purple-100': tailwindColors.purple['100'],
  'purple-200': tailwindColors.purple['200'],
  'purple-300': tailwindColors.purple['300'],
  'purple-400': tailwindColors.purple['400'],
  'purple-500': tailwindColors.purple['500'],
  'purple-600': tailwindColors.purple['600'],
  'purple-700': tailwindColors.purple['700'],
  'purple-800': tailwindColors.purple['800'],
  'purple-900': tailwindColors.purple['900'],
  'fuchsia-50': tailwindColors.fuchsia['50'],
  'fuchsia-100': tailwindColors.fuchsia['100'],
  'fuchsia-200': tailwindColors.fuchsia['200'],
  'fuchsia-300': tailwindColors.fuchsia['300'],
  'fuchsia-400': tailwindColors.fuchsia['400'],
  'fuchsia-500': tailwindColors.fuchsia['500'],
  'fuchsia-600': tailwindColors.fuchsia['600'],
  'fuchsia-700': tailwindColors.fuchsia['700'],
  'fuchsia-800': tailwindColors.fuchsia['800'],
  'fuchsia-900': tailwindColors.fuchsia['900'],
  'pink-50': tailwindColors.pink['50'],
  'pink-100': tailwindColors.pink['100'],
  'pink-200': tailwindColors.pink['200'],
  'pink-300': tailwindColors.pink['300'],
  'pink-400': tailwindColors.pink['400'],
  'pink-500': tailwindColors.pink['500'],
  'pink-600': tailwindColors.pink['600'],
  'pink-700': tailwindColors.pink['700'],
  'pink-800': tailwindColors.pink['800'],
  'pink-900': tailwindColors.pink['900'],
  'rose-50': tailwindColors.rose['50'],
  'rose-100': tailwindColors.rose['100'],
  'rose-200': tailwindColors.rose['200'],
  'rose-300': tailwindColors.rose['300'],
  'rose-400': tailwindColors.rose['400'],
  'rose-500': tailwindColors.rose['500'],
  'rose-600': tailwindColors.rose['600'],
  'rose-700': tailwindColors.rose['700'],
  'rose-800': tailwindColors.rose['800'],
  'rose-900': tailwindColors.rose['900'],
  ButtonBorder: 'ButtonBorder',
  ButtonText: 'ButtonText',
  Field: 'Field',
  Highlight: 'Highlight',
  HighlightText: 'HighlightText',
  GrayText: 'GrayText',
  Mark: 'Mark',
};

const spacing = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

const sizing = {
  ...spacing,
  auto: 'auto',
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.666667%',
  '2/6': '33.333333%',
  '3/6': '50%',
  '4/6': '66.666667%',
  '5/6': '83.333333%',
  full: '100%',
  screen: '100vh',
  svh: '100svh',
  lvh: '100lvh',
  dvh: '100dvh',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content'
};

const margin = {
  ...spacing,
  auto: 'auto'
};

const inset = {
  ...spacing,
  auto: 'auto',
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  full: '100%',
};

const borderWidth = {
  0: '0px',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

const radius = {
  none: '0px',
  sm: '0.125rem',
  default: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

type GridTrack = 'none' | 'subgrid' | (string & {}) | GridTrackSize[];
type GridTrackSize = 'auto' | 'min-content' | 'max-content' | `${number}fr` | `minmax(${string}, ${string})` | keyof typeof spacing;

let gridTrack = (value: GridTrack) => {
  if (typeof value === 'string') {
    return value;
  }
  return value.map(v => gridTrackSize(v)).join(' ');
};

let gridTrackSize = (value: GridTrackSize) => {
  // @ts-ignore
  return value in spacing ? spacing[value] : value
};

const transitionProperty = {
  default: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
  colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
  all: 'all',
  none: 'none',
};

const transitionTimingFunction = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
};

const colorWithAlpha = createColorProperty(color);

export const style = createTheme({
  properties: {
    // colors
    color: colorWithAlpha,
    backgroundColor: colorWithAlpha,
    borderColor: colorWithAlpha,
    outlineColor: colorWithAlpha,
    textDecorationColor: colorWithAlpha,
    accentColor: colorWithAlpha,
    caretColor: colorWithAlpha,
    fill: createColorProperty({
      none: 'none',
      ...color
    }),
    stroke: createColorProperty({
      none: 'none',
      ...color
    }),

    // dimensions
    borderSpacing: spacing, // TODO: separate x and y
    flexBasis: {
      auto: 'auto',
      ...spacing
    },
    rowGap: spacing,
    columnGap: spacing,
    height: sizing,
    width: sizing,
    minHeight: {
      ...spacing,
      full: '100%',
      screen: '100vh',
      svh: '100svh',
      lvh: '100lvh',
      dvh: '100dvh',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    },
    maxHeight: {
      ...spacing,
      none: 'none',
      full: '100%',
      screen: '100vh',
      svh: '100svh',
      lvh: '100lvh',
      dvh: '100dvh',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    },
    minWidth: {
      ...spacing,
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content'
    },
    maxWidth: {
      ...spacing,
      none: 'none',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
      prose: '65ch',
      // breakpoints
    },
    borderWidth,
    borderStartWidth: createMappedProperty(value => ({borderInlineStartWidth: value}), borderWidth),
    borderEndWidth: createMappedProperty(value => ({borderInlineEndWidth: value}), borderWidth),
    borderTopWidth: borderWidth,
    borderBottomWidth: borderWidth,
    borderXWidth: createMappedProperty(value => ({borderInlineWidth: value}), borderWidth),
    borderYWidth: createMappedProperty(value => ({borderBlockWidth: value}), borderWidth),
    borderStyle: ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'] as const,
    strokeWidth: {
      0: '0',
      1: '1',
      2: '2',
    },
    marginStart: createMappedProperty(value => ({marginInlineStart: value}), margin),
    marginEnd: createMappedProperty(value => ({marginInlineEnd: value}), margin),
    marginTop: margin,
    marginBottom: margin,
    paddingStart: createMappedProperty(value => ({paddingInlineStart: value}), spacing),
    paddingEnd: createMappedProperty(value => ({paddingInlineEnd: value}), spacing),
    paddingTop: spacing,
    paddingBottom: spacing,
    scrollMarginStart: createMappedProperty(value => ({scrollMarginInlineStart: value}), spacing),
    scrollMarginEnd: createMappedProperty(value => ({scrollMarginInlineEnd: value}), spacing),
    scrollMarginTop: spacing,
    scrollMarginBottom: spacing,
    scrollPaddingStart: createMappedProperty(value => ({scrollPaddingInlineStart: value}), spacing),
    scrollPaddingEnd: createMappedProperty(value => ({scrollPaddingInlineEnd: value}), spacing),
    scrollPaddingTop: spacing,
    scrollPaddingBottom: spacing,
    textIndent: spacing,
    translate: {
      ...spacing,
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      full: '100%',
    },
    rotate: createArbitraryProperty((value: number | `${number}deg` | `${number}rad` | `${number}grad` | `${number}turn`) => ({rotate: typeof value === 'number' ? `${value}deg` : value})),
    scale: createArbitraryProperty((value: number) => ({scale: value})),
    position: ['absolute', 'fixed', 'relative', 'sticky', 'static'] as const,
    insetStart: createMappedProperty(value => ({insetInlineStart: value}), inset),
    insetEnd: createMappedProperty(value => ({insetInlineEnd: value}), inset),
    top: inset,
    left: inset,
    bottom: inset,
    right: inset,
    aspectRatio: {
      auto: 'auto',
      square: '1 / 1',
      video: '16 / 9'
    },

    // text
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, Menlo, Monaco, Consalas, "Courier New", monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem'
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    fontStyle: ['normal', 'italic'] as const,
    // fontVariantNumeric:
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
      3: '.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
    },
    listStyleType: ['none', 'dist', 'decimal'] as const,
    listStylePosition: ['inside', 'outside'] as const,
    textTransform: ['uppercase', 'lowercase', 'capitalize', 'none'] as const,
    textAlign: ['start', 'center', 'end', 'justify'] as const,
    verticalAlign: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super'] as const,
    textDecoration: ['underline', 'overline', 'line-through', 'none'] as const,
    textDecorationStyle: ['solid', 'double', 'dotted', 'dashed', 'wavy'] as const,
    textDecorationThickness: {
      auto: 'auto',
      'from-font': 'from-font',
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    textUnderlineOffset: {
      auto: 'auto',
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    textOverflow: ['ellipsis', 'clip'] as const,
    truncate: createArbitraryProperty((_value: true) => ({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    })),
    lineClamp: createArbitraryProperty((value: number) => ({
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': value
    })),
    hyphens: ['none', 'manual', 'auto'] as const,
    whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'] as const,
    textWrap: ['wrap', 'nowrap', 'balance', 'pretty'] as const,
    wordBreak: ['normal', 'break-all', 'keep-all'] as const, // also overflowWrap??
    boxDecorationBreak: ['slice', 'clone'] as const,

    // effects
    boxShadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: 'none',
    },
    borderTopStartRadius: createMappedProperty(value => ({borderStartStartRadius: value}), radius),
    borderTopEndRadius: createMappedProperty(value => ({borderStartEndRadius: value}), radius),
    borderBottomStartRadius: createMappedProperty(value => ({borderEndStartRadius: value}), radius),
    borderBottomEndRadius: createMappedProperty(value => ({borderEndEndRadius: value}), radius),
    forcedColorAdjust: ['auto', 'none'] as const,
    backgroundPosition: ['bottom', 'center', 'left', 'left bottom', 'left top', 'right', 'right bottom', 'right top', 'top'] as const,
    backgroundSize: ['auto', 'cover', 'contain'] as const,
    backgroundAttachment: ['fixed', 'local', 'scroll'] as const,
    backgroundClip: ['border-box', 'padding-box', 'content-box', 'text'] as const,
    backgroundRepeat: ['repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'round', 'space'] as const,
    backgroundOrigin: ['border-box', 'padding-box', 'content-box'] as const,
    backgroundBlendMode: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'] as const,
    mixBlendMode: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity', 'plus-darker', 'plus-lighter'] as const,
    opacity: createArbitraryProperty((value: number) => ({opacity: value})),
    // filter, backdropFilter

    outlineStyle: ['none', 'solid', 'dashed', 'dotted', 'double'] as const,
    outlineOffset: {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    outlineWidth: {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },

    transition: createMappedProperty(value => ({
      transitionProperty: value,
      transitionDuration: '150ms',
      transitionTimingFunction: transitionTimingFunction.default
    }), transitionProperty),
    transitionDelay: {
      0: '0s',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    transitionDuration: {
      0: '0s',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    transitionTimingFunction,

    // layout
    display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'contents', 'list-item', 'none'] as const, // tables?
    alignContent: ['normal', 'center', 'start', 'end', 'space-between', 'space-around', 'space-evenly', 'baseline', 'stretch'] as const,
    alignItems: ['start', 'end', 'center', 'baseline', 'stretch'] as const,
    justifyContent: ['normal', 'start', 'end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch'] as const,
    justifyItems: ['start', 'end', 'center', 'stretch'] as const,
    alignSelf: ['auto', 'start', 'end', 'center', 'stretch', 'baseline'] as const,
    justifySelf: ['auto', 'start', 'end', 'center', 'stretch'] as const,
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'] as const,
    flexWrap: ['wrap', 'wrap-reverse', 'nowrap'] as const,
    flex: createArbitraryProperty((value: CSS.Property.Flex) => ({flex: value})),
    flexShrink: createArbitraryProperty((value: CSS.Property.FlexShrink) => ({flexShrink: value})),
    flexGrow: createArbitraryProperty((value: CSS.Property.FlexGrow) => ({flexGrow: value})),
    gridColumn: createArbitraryProperty((value: CSS.Property.GridColumn) => ({gridColumn: value})),
    gridColumnStart: createArbitraryProperty((value: CSS.Property.GridColumnStart) => ({gridColumnStart: value})),
    gridColumnEnd: createArbitraryProperty((value: CSS.Property.GridColumnEnd) => ({gridColumnEnd: value})),
    gridRow: createArbitraryProperty((value: CSS.Property.GridRow) => ({gridRow: value})),
    gridRowStart: createArbitraryProperty((value: CSS.Property.GridRowStart) => ({gridRowStart: value})),
    gridRowEnd: createArbitraryProperty((value: CSS.Property.GridRowEnd) => ({gridRowEnd: value})),
    gridAutoFlow: ['row', 'column', 'dense', 'row dense', 'column dense'] as const,
    gridAutoRows: createArbitraryProperty((value: GridTrackSize) => ({gridAutoRows: gridTrackSize(value)})),
    gridAutoColumns: createArbitraryProperty((value: GridTrackSize) => ({gridAutoRows: gridTrackSize(value)})),
    gridTemplateColumns: createArbitraryProperty((value: GridTrack) => ({gridTemplateColumns: gridTrack(value)})),
    gridTemplateRows: createArbitraryProperty((value: GridTrack) => ({gridTemplateRows: gridTrack(value)})),
    float: ['inline-start', 'inline-end', 'right', 'left', 'none'] as const,
    clear: ['inline-start', 'inline-end', 'left', 'right', 'both', 'none'] as const,
    boxSizing: ['border-box', 'content-box'] as const,
    tableLayout: ['auto', 'fixed'] as const,
    captionSide: ['top', 'bottom'] as const,
    borderCollapse: ['collapse', 'separate'] as const,
    columns: {
      auto: 'auto',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      '3xs': '16rem',
      '2xs': '18rem',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
    },
    breakBefore: ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'] as const,
    breakInside: ['auto', 'avoid', 'avoid-page', 'avoid-column'] as const,
    breakAfter: ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'] as const,
    overflowX: ['auto', 'hidden', 'clip', 'visible', 'scroll'] as const,
    overflowY: ['auto', 'hidden', 'clip', 'visible', 'scroll'] as const,
    overscrollBehaviorX: ['auto', 'contain', 'none'] as const,
    overscrollBehaviorY: ['auto', 'contain', 'none'] as const,
    scrollBehavior: ['auto', 'smooth'] as const,
    order: createArbitraryProperty((value: number) => ({order: value})),

    pointerEvents: ['none', 'auto'] as const,
    touchAction: ['auto', 'none', 'pan-x', 'pan-y', 'manipulation', 'pinch-zoom'] as const,
    userSelect: ['none', 'text', 'all', 'auto'] as const,
    visibility: ['visible', 'hidden', 'collapse'] as const,
    isolation: ['isolate', 'auto'] as const,
    transformOrigin: ['center', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left', 'left', 'top right'] as const,
    cursor: ['auto', 'default', 'pointer', 'wait', 'text', 'move', 'help', 'not-allowed', 'none', 'context-menu', 'progress', 'cell', 'crosshair', 'vertical-text', 'alias', 'copy', 'no-drop', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out'] as const,
    resize: ['none', 'vertical', 'horizontal', 'both'] as const,
    scrollSnapType: ['x', 'y', 'both', 'x mandatory', 'y mandatory', 'both mandatory'] as const,
    scrollSnapAlign: ['start', 'end', 'center', 'none'] as const,
    scrollSnapStop: ['normal', 'always'] as const,
    appearance: ['none', 'auto'] as const,
    objectFit: ['contain', 'cover', 'fill', 'none', 'scale-down'] as const,
    objectPosition: ['bottom', 'center', 'left', 'left bottom', 'left top', 'right', 'right bottom', 'right top', 'top'] as const,
    willChange: ['auto', 'scroll-position', 'contents', 'transform'] as const,
    zIndex: createArbitraryProperty((value: number) => ({zIndex: value})),
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingStart', 'paddingEnd'] as const,
    paddingX: ['paddingStart', 'paddingEnd'] as const,
    paddingY: ['paddingTop', 'paddingBottom'] as const,
    margin: ['marginTop', 'marginBottom', 'marginStart', 'marginEnd'] as const,
    marginX: ['marginStart', 'marginEnd'] as const,
    marginY: ['marginTop', 'marginBottom'] as const,
    scrollPadding: ['scrollPaddingTop', 'scrollPaddingBottom', 'scrollPaddingStart', 'scrollPaddingEnd'] as const,
    scrollPaddingX: ['scrollPaddingStart', 'scrollPaddingEnd'] as const,
    scrollPaddingY: ['scrollPaddingTop', 'scrollPaddingBottom'] as const,
    scrollMargin: ['scrollMarginTop', 'scrollMarginBottom', 'scrollMarginStart', 'scrollMarginEnd'] as const,
    scrollMarginX: ['scrollMarginStart', 'scrollMarginEnd'] as const,
    scrollMarginY: ['scrollMarginTop', 'scrollMarginBottom'] as const,
    borderWidth: ['borderTopWidth', 'borderBottomWidth', 'borderStartWidth', 'borderEndWidth'] as const,
    borderXWidth: ['borderStartWidth', 'borderEndWidth'] as const,
    borderYWidth: ['borderTopWidth', 'borderBottomWidth'] as const,
    borderRadius: ['borderTopStartRadius', 'borderTopEndRadius', 'borderBottomStartRadius', 'borderBottomEndRadius'] as const,
    borderTopRadius: ['borderTopStartRadius', 'borderTopEndRadius'] as const,
    borderBottomRadius: ['borderBottomStartRadius', 'borderBottomEndRadius'] as const,
    borderStartRadius: ['borderTopStartRadius', 'borderBottomStartRadius'] as const,
    borderEndRadius: ['borderTopEndRadius', 'borderBottomEndRadius'] as const,
    insetX: ['insetStart', 'insetEnd'] as const,
    insetY: ['top', 'bottom'] as const,
    placeItems: ['alignItems', 'justifyItems'] as const,
    placeContent: ['alignContent', 'justifyContent'] as const,
    placeSelf: ['alignSelf', 'justifySelf'] as const,
    gap: ['rowGap', 'columnGap'] as const,
    size: ['width', 'height'] as const,
    overflow: ['overflowX', 'overflowY'] as const,
    overscrollBehavior: ['overscrollBehaviorX', 'overscrollBehaviorY'] as const
  },
  conditions: {
    dark: '@media (prefers-color-scheme: dark)',
    forcedColors: '@media (forced-colors: active)',
    sm: '@media (min-width: 640px)',
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
    xl: '@media (min-width: 1280px)',
    '2xl': '@media (min-width: 1536px)'
  }
});
