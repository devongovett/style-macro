// type PropertyFunction = (value: any) => string;
//

interface PropertyValueMap {
  [name: string]: string
}

interface Theme {
  properties: {
    [name: string]: PropertyValueMap,
  },
  conditions: {
    [name: string]: string
  }
}

// type PropertyValue<T extends PropertyFunction> = T extends (value: infer P) => string ? P : never;

type Style<T extends Theme> = {
  [Name in keyof T['properties']]?: StyleValue<(keyof T['properties'][Name] & string) | `--${string}`, T>
};

type StyleValue<V extends string | number, T extends Theme> = V | Conditional<V, T>;
type Condition<T extends Theme> = keyof T['conditions'] & string;
type Conditional<V extends string | number, T extends Theme> = {
  [name in Condition<T> | 'default' | (string & {})]?: StyleValue<V, T>
};

type RecursiveConditions<T extends Theme, C extends Conditional<any, any>> = {
  [Name in keyof C]: 
    Name extends (keyof T['conditions'] | 'default') 
      ? never 
      : C[Name] extends Conditional<any, any> 
        ? Name | RecursiveConditions<T, C[Name]> 
        : Name
}[keyof C];

type ExtractConditionals<T extends Theme, S extends Style<any>> = {
  [Name in keyof S]: S[Name] extends Conditional<any, any> ? RecursiveConditions<T, S[Name]> : never
}[keyof S];

type RuntimeConditionsObject<T extends Theme, S extends Style<T>> = {
  [Name in ExtractConditionals<T, S>]?: boolean
};

type RuntimeStyleFunction<T extends Theme, S extends Style<T>> = (props: RuntimeConditionsObject<T, S>) => string;
type StyleFunction<T extends Theme> = <S extends Style<T>>(style: S) => RuntimeStyleFunction<T, S>;

export function createTheme<T extends Theme>(theme: T): StyleFunction<T> {
  let themePropertyKeys = Object.keys(theme.properties);
  let themeConditionKeys = Object.keys(theme.conditions);

  return function style<S extends Style<T>>(style: S) {
    let css = '';
    let js = 'let rules = "";\n';
    let printedRules = new Set<string>();
    for (let key in style) {
      let value = style[key]!;
      let rules = compileValue([], key, value);
      js += printJS(rules) + '\n';
      for (let rule of rules) {
        css += printRule(rule, printedRules) + '\n\n';
      }
    }

    js += 'return rules;';
    console.log(css)
    console.log(js);

    this.addAsset({
      type: 'css',
      content: css
    });

    return new Function('props', js) as RuntimeStyleFunction<T, S>;
  }

  function compileValue(conditions: Condition<T>[], property: string, value: StyleValue<string | number, T>) {
    if (typeof value === 'object' && value) {
      let rules: Rule[] = [];
      for (let condition in theme.conditions) {
        if (value[condition] != null) {
          let c = conditions;
          if (condition !== 'default') {
            c = c.concat(condition);
          }
          rules.push(compileCondition(condition, compileValue(c, property, value[condition])));
        }
      }

      // Runtime conditions.
      for (let condition in value) {
        if (condition in theme.conditions) {
          continue;
        }

        let cond = condition as Condition<T>;
        let val = value[cond];
        if (typeof val == 'object' && val) {
          for (let key in theme.conditions) {
            if (key in value && !(key in val)) {
              val[key] = value[key];
              // console.log(key, value[key])
            }
          }
        }
        rules.push(compileCondition(cond, compileValue(conditions, property, value[cond]!)));
      }
      return rules;
    } else {
      return [compileRule(conditions, property, value)];
    }
  }

  function compileCondition(condition: Condition<T>, rules: Rule[]): Rule {
    if (condition === 'default') {
      return {prelude: '', condition: '', body: rules};
    }

    if (condition in theme.conditions) {
      return {prelude: theme.conditions[condition], body: rules, condition: ''};
    }

    return {prelude: '', condition, body: rules};
  }

  function compileRule(conditions: Condition<T>[], property: string, value: string | number): Rule {
    // let prelude = `.${appendPrefix(conditions.join('-'), property)}-${value}`;
    let prelude = '.' + conditions.map(c => generateName(themeConditionKeys.indexOf(c))).join('') + generateName(themePropertyKeys.indexOf(property));
    if (property in theme.properties) {
      if (typeof value === 'string' && value.startsWith('--')) {
        prelude += value;
        value = `var(${value})`;
      } else {
        prelude += generateName(Object.keys(theme.properties[property]).indexOf(String(value)));
        value = theme.properties[property][value];
      }
    }

    if (!property.startsWith('--')) {
      property = property.replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`);
    }

    return {
      condition: '',
      prelude,
      body: `${property}: ${value}`
    };
  }
}

// const color = ['white', 'Highlight', 'HighlightText', 'GrayText', 'Mark'];
const color = {
  white: 'white',
  Highlight: 'Highlight',
  HighlightText: 'HighlightText',
  GrayText: 'GrayText',
  Mark: 'Mark',
  'gray-100': 'var(--gray-100)',
  'gray-200': 'var(--gray-200)',
  'gray-300': 'var(--gray-300)',
  'gray-400': 'var(--gray-400)',
  'gray-500': 'var(--gray-500)',
  'gray-600': 'var(--gray-600)',
  'gray-700': 'var(--gray-700)',
  'gray-800': 'var(--gray-800)',
  'gray-900': 'var(--gray-900)',
  'slate-100': 'var(--slate-100)',
  'slate-200': 'var(--slate-200)',
  'slate-300': 'var(--slate-300)',
  'slate-400': 'var(--slate-400)',
  'slate-500': 'var(--slate-500)',
  'slate-600': 'var(--slate-600)',
  'slate-700': 'var(--slate-700)',
  'slate-800': 'var(--slate-800)',
  'slate-900': 'var(--slate-900)',
  'zinc-100': 'var(--zinc-100)',
  'zinc-200': 'var(--zinc-200)',
  'zinc-300': 'var(--zinc-300)',
  'zinc-400': 'var(--zinc-400)',
  'zinc-500': 'var(--zinc-500)',
  'zinc-600': 'var(--zinc-600)',
  'zinc-700': 'var(--zinc-700)',
  'zinc-800': 'var(--zinc-800)',
  'zinc-900': 'var(--zinc-900)',
  'red-100': 'var(--red-100)',
  'red-200': 'var(--red-200)',
  'red-300': 'var(--red-300)',
  'red-400': 'var(--red-400)',
  'red-500': 'var(--red-500)',
  'red-600': 'var(--red-600)',
  'red-700': 'var(--red-700)',
  'red-800': 'var(--red-800)',
  'red-900': 'var(--red-900)',
  'blue-100': 'var(--blue-100)',
  'blue-200': 'var(--blue-200)',
  'blue-300': 'var(--blue-300)',
  'blue-400': 'var(--blue-400)',
  'blue-500': 'var(--blue-500)',
  'blue-600': 'var(--blue-600)',
  'blue-700': 'var(--blue-700)',
  'blue-800': 'var(--blue-800)',
  'blue-900': 'var(--blue-900)',
};

export const style = createTheme({
  properties: {
    background: color,
    borderColor: color,
    outlineColor: color,
    '--color': color
  },
  conditions: {
    dark: '@media (prefers-color-scheme: dark)',
    forcedColors: '@media (forced-colors: active)'
  }
});

interface Rule {
  prelude: string,
  condition: string,
  body: string | Rule[]
}

function appendPrefix(prefix: string, value: string) {
  if (value === 'default') {
    return prefix;
  }

  return (prefix ? prefix + '-' : '') + value;
}

function generateName(index: number) {
  console.log(index)
  if (index < 26) {
    // lower case letters
    return String.fromCharCode(index + 97);
  }

  if (index < 52) {
    // upper case letters
    return String.fromCharCode((index - 26) + 65);
  }

  if (index < 62) {
    // numbers
    return String.fromCharCode((index - 52) + 48);
  }
}

function printRule(rule: Rule, printedRules: Set<string>, indent = ''): string {
  if (!rule.prelude && typeof rule.body !== 'string') {
    return rule.body.map(b => printRule(b, printedRules, indent)).join('\n\n')
  }

  if (typeof rule.body === 'string') {
    if (printedRules.has(rule.prelude)) {
      return '';
    }
    printedRules.add(rule.prelude);
  }

  return `${indent}${rule.prelude} {
${typeof rule.body === 'string' ? indent + '  ' + rule.body : rule.body.map(b => printRule(b, printedRules, indent + '  ')).join('\n\n')}
${indent}}`;
}

function printJS(rules: Rule[], indent = ''): string {
  rules = rules.slice().reverse();

  let conditional = rules.filter(rule => rule.condition).map((rule, i) => {
    return `${i > 0 ? ' else ' : ''}if (props.${rule.condition}) {\n${indent}  ${printRuleChildren(rule, indent + '  ')}\n${indent}}`;
  });

  let elseCases = rules.filter(rule => !rule.condition).map(rule => printRuleChildren(rule, indent + '  '));

  if (conditional.length && elseCases.length) {
    return `${conditional.join('')} else {\n${indent}  ${elseCases.join('\n' + indent + '  ')}\n${indent}}`;
  }

  if (conditional.length) {
    return conditional.join('');
  }

  return elseCases.join('\n' + indent);
}

function printRuleChildren(rule: Rule, indent = '') {
  return typeof rule.body === 'string'
    ? `rules += ' ${rule.prelude.slice(1)}';`
    : printJS(rule.body, indent);
}
