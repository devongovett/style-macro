import tailwindColors from 'tailwindcss/colors';
import { createColorProperty, createMappedProperty, createTheme, createArbitraryProperty } from './style-macro.ts';
import type * as CSS from 'csstype';
import tokens from '@adobe/spectrum-tokens/dist/json/variables.json';

function colorToken(token: typeof tokens['gray-25']) {
  return {
    light: token.sets.light.value,
    dark: token.sets.dark.value
  };
}

const color = {
  transparent: 'transparent',
  black: 'black',
  white: 'white',
  
  'gray-25': colorToken(tokens['gray-25']),
  'gray-50': colorToken(tokens['gray-50']),
  'gray-75': colorToken(tokens['gray-75']),
  'gray-100': colorToken(tokens['gray-100']),
  'gray-200': colorToken(tokens['gray-200']),
  'gray-300': colorToken(tokens['gray-300']),
  'gray-400': colorToken(tokens['gray-400']),
  'gray-500': colorToken(tokens['gray-500']),
  'gray-600': colorToken(tokens['gray-600']),
  'gray-700': colorToken(tokens['gray-700']),
  'gray-800': colorToken(tokens['gray-800']),
  'gray-900': colorToken(tokens['gray-900']),
  'gray-1000': colorToken(tokens['gray-1000']),

  // High contrast mode.
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
    gap: spacing,
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
