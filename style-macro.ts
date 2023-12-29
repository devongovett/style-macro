import type * as CSS from 'csstype';

type CSSValue = string | number;
type CustomValue = string | number | boolean;
type Value = CustomValue | CustomValue[];
type PropertyValueMap<T extends CSSValue = CSSValue> = {
  [name in T]: string
};

type CSSProperties = CSS.Properties & {
  [k: `--${string}`]: CSSValue
};

interface PropertyFunction<T extends Value> {
  (value: CSSValue, property: string): CSSProperties,
  getValue: (value: T) => [CSSValue, string]
}

interface Theme {
  properties: {
    [name: string]: PropertyValueMap | PropertyFunction<any> | string[],
  },
  conditions: {
    [name: string]: string
  }
}

type PropertyValue<T> =
  T extends PropertyFunction<any>
    ? T['getValue'] extends (value: infer P) => [CSSValue, string]
      ? P
      : never
    : T extends PropertyValueMap
      ? keyof T
      : T extends string[]
        ? T[number]
        : never;

type Style<T extends Theme, R extends RenderProps<string>> = {
  [Name in keyof T['properties']]?: StyleValue<PropertyValue<T['properties'][Name]> | `--${string}` | `[${string}]`, Condition<T>, R>
};

type RenderProps<K extends string> = {
  [key in K]: any
};

type StyleValue<V extends Value, C extends string, R extends RenderProps<string>> = V | Conditional<V, C, R>;
type Condition<T extends Theme> = (keyof T['conditions'] & string) | 'default';
type Conditional<V extends Value, C extends string, R extends RenderProps<string>> = {
  [name in C | (IsUnion<Keys<R>, Keys<R>, (string & {})>)]?:
    name extends C 
      ? StyleValue<V, C, R>
      : name extends `is${string}` 
        ? StyleValue<V, C, R>
        : IsUnion<Keys<R>, VariantMap<R[name], V, C, R>, StyleValue<V, C, R>>
};

type VariantMap<K extends string, V extends Value, C extends string, R extends RenderProps<string>> = {
  [k in K]?: StyleValue<V, C, R>
};

type RecursiveConditions<B extends string, C extends Conditional<any, any, any>> = {
  [Name in keyof C]: (Name extends B ? never : Name) | (C[Name] extends Value ? never : RecursiveConditions<B, C[Name]>)
}[keyof C];

type ExtractConditionals<C extends string, S extends Style<any, any>> = {
  [Name in keyof S]: S[Name] extends Conditional<any, any, any> ? RecursiveConditions<C, S[Name]> : never
}[keyof S];

type RuntimeConditionsObject<C extends string, S extends Style<any, any>> = {
  [Name in ExtractConditionals<C, S>]?: boolean
};

type Keys<T extends RenderProps<string>> = T extends RenderProps<infer K> ? K : never;
type IsUnion<T, A, B, U extends T = T> = T extends unknown ? [U] extends [T] ? B : A : B;
type InferProps<C extends string, S extends Style<any, any>, R extends RenderProps<string>> = IsUnion<Keys<R>, Partial<R>, RuntimeConditionsObject<C, S>>
type RuntimeStyleFunction<R> = keyof R extends never ? () => string : (props: R) => string;
type StyleFunction<T extends Theme> = <R extends RenderProps<string>, S extends Style<T, R> = Style<T, R>>(style: S) => RuntimeStyleFunction<InferProps<Condition<T>, S, R>>;

export function property<T extends Value>(fn: (value: T) => CSSProperties): PropertyFunction<T>
export function property<T extends CSSValue>(fn: (value: string) => CSSProperties, values: PropertyValueMap<T>): PropertyFunction<T>
export function property<T extends CSSValue>(fn: (value: string) => CSSProperties, values?: PropertyValueMap<T>): PropertyFunction<T> {
  let f: any = (value: any) => fn(value);
  if (values) {
    let keys = Object.keys(values);
    f.getValue = (value: T) => [values[value], generateName(keys.indexOf(String(value)))];
  } else {
    f.getValue = (value: string) => {
      let v = Array.isArray(value) ? value.map(v => generateArbitraryValueSelector(String(v))).join('') : generateArbitraryValueSelector(String(value));
      return [value, v];
    };
  }
  return f;
}

type Color<C extends string> = C | `${C}/${number}`;
export function createColorProperty<C extends string>(colors: PropertyValueMap<C>, property?: keyof CSSProperties): PropertyFunction<Color<C>> {
  let keys = Object.keys(colors);
  let f: any = (value: CSSValue, key: string) => ({[property || key]: value});
  f.getValue = (value: Color<C>) => {
    let [color, opacity] = value.split('/');
    // @ts-ignore
    let c = colors[color];
    let css = opacity ? `rgb(from ${c} r g b / ${opacity}%)` : c;
    let selector = generateName(keys.indexOf(color)) + (opacity ? opacity.replace('.', '-') : '');
    return [css, selector];
  };
  return f;
}

export function createTheme<T extends Theme>(theme: T): StyleFunction<T> {
  let themePropertyKeys = Object.keys(theme.properties);
  let themeConditionKeys = Object.keys(theme.conditions);

  return function style(style) {
    let css = '@layer a';
    for (let i = 0; i < themeConditionKeys.length; i++) {
      css += ', ' + generateName(i + 1);
    }
    css += ';\n\n';

    let js = 'let rules = "";\n';
    let printedRules = new Set<string>();
    for (let key in theme.properties) {
      if (key in style) {
        let value = style[key]!;
        let rules = compileValue([], key, value);
        js += printJS(rules) + '\n';
        for (let rule of rules) {
          css += printRule(rule, printedRules) + '\n\n';
        }
      }
    }

    js += 'return rules;';
    // console.log(css)
    // console.log(js);

    // @ts-ignore
    this.addAsset({
      type: 'css',
      content: css
    });

    return new Function('props', js) as any;
  }

  function compileValue(conditions: Condition<T>[], property: string, value: StyleValue<Value, Condition<T>, any>) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      let rules: Rule[] = [];
      if (value.default != null) {
        rules.push(compileCondition('default', compileValue(conditions, property, value.default)));
      }

      for (let condition in theme.conditions) {
        if (value[condition] != null) {
          let c = conditions.concat(condition);
          rules.push(compileCondition(condition, compileValue(c, property, value[condition]!)));
        }
      }

      // Runtime conditions.
      for (let condition in value) {
        if (condition === 'default' || condition in theme.conditions) {
          continue;
        }

        let cond = condition as Condition<T>;
        let val = value[cond]!;
        if (typeof val == 'object' && val) {
          for (let key in theme.conditions) {
            if (key in value && !(key in val)) {
              val[key] = value[key];
              // console.log(key, value[key])
            }
          }
        }
        if (cond.startsWith('is')) {
          rules.push(compileCondition(cond, compileValue(conditions, property, val)));
        } else if (typeof val === 'object' && val) {
          let v = val as VariantMap<string, Value, Condition<T>, any>;
          for (let key in v) {
            rules.push(compileCondition(`${cond} === ${JSON.stringify(key)}`, compileValue(conditions, property, v[key]!)));
          }
        }
      }
      return rules;
    } else if (conditions.length === 0) {
      return [{
        prelude: '@layer a',
        body: [compileRule(conditions, property, value)],
        condition: ''
      }]
    } else {
      return [compileRule(conditions, property, value)];
    }
  }

  function compileCondition(condition: string, rules: Rule[]): Rule {
    if (condition === 'default') {
      return {prelude: '', condition: '', body: rules};
    }

    if (condition in theme.conditions) {
      // return {prelude: theme.conditions[condition], body: rules, condition: ''};
      return {prelude: `@layer ${generateName(themeConditionKeys.indexOf(condition) + 1)}`, body: [{prelude: theme.conditions[condition], body: rules, condition: ''}], condition: ''};
    }

    return {prelude: '', condition, body: rules};
  }

  function compileRule(conditions: Condition<T>[], property: string, value: Value): Rule {
    let prelude = '.' + generateName(themePropertyKeys.indexOf(property), true) + conditions.map(c => generateName(themeConditionKeys.indexOf(c))).join('');
    let p = property.startsWith('--') ? property : kebab(property);

    let body = '';
    if (property in theme.properties) {
      if (typeof value === 'string' && value.startsWith('--')) {
        prelude += value;
        body = `${p}: var(${value})`;
      } else if (typeof value === 'string' && value[0] === '[' && value[value.length - 1] === ']') {
        prelude += generateArbitraryValueSelector(value.slice(1, -1));
        body = `${p}: ${value.slice(1, -1)}`;
      } else {
        let v = theme.properties[property];
        if (typeof v === 'function') {
          let [val, p] = v.getValue(value);
          prelude += p;
          let obj = v(val, property);
          for (let key in obj) {
            body += `${kebab(key)}: ${obj[key]};`
          }
        } else if (Array.isArray(v)) {
          prelude += generateName(v.indexOf(String(value)));
          body = `${p}: ${value}`;
        } else if (typeof value !== 'object') {
          let val = String(value);
          prelude += generateName(Object.keys(theme.properties[property]).indexOf(String(val)));
          body = `${p}: ${v[val]}`;
        } else {
          throw new Error(`Invalid value: ${value}`);
        }
      }
    }

    return {
      condition: '',
      prelude,
      body
    };
  }
}

function kebab(property: string) {
  return property.replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`);
}

interface Rule {
  prelude: string,
  condition: string,
  body: string | Rule[]
}

function generateName(index: number, atStart = false): string {
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
    let res = String.fromCharCode((index - 52) + 48);
    if (atStart) {
      res = '_' + res;
    }
    return res;
  }

  return '_' + generateName(index - 62);
}

function generateArbitraryValueSelector(v: string, atStart = false) {
  let c = hash(v).toString(36);
  if (atStart) {
    return /^[0-9]/.test(c) ? '_' + c : c;
  } else {
    return '-' + c;
  }
}

function hash(v: string) {
  let hash = 5381;
  for (let i = 0; i < v.length; i++) {
    hash = ((hash << 5) + hash) + v.charCodeAt(i) >>> 0;
  }
  return hash;
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

export function raw(css: string) {
  let className = generateArbitraryValueSelector(css, true);
  css = `.${className} {
  ${css}
}`;
  this.addAsset({
    type: 'css',
    content: css
  });
  return className;
}

// taken from: https://stackoverflow.com/questions/51603250/typescript-3-parameter-list-intersection-type/51604379#51604379
type ArgTypes<T> = T extends (props: infer V) => any ? NullToObject<V> : never;
type NullToObject<T> = T extends (null | undefined) ? {} : T;
type BoxedTupleTypes<T extends any[]> = { [P in keyof T]: [ArgTypes<T[P]>] }[Exclude<keyof T, keyof any[]>];
type UnboxIntersection<T> = T extends { 0: infer U } ? U : never;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export function merge<T extends (RuntimeStyleFunction<any> | null | undefined)[]>(...args: T): (props: UnboxIntersection<UnionToIntersection<BoxedTupleTypes<T>>>) => string {
  return (props) => {
    return dedupe(args.map(f => typeof f === 'function' ? f(props) : '').join(''));
  };
}

function dedupe(s: string) {
  let properties = new Map<string, string>();
  let i = 0;
  while (i < s.length) {
    while (i < s.length && s[i] === ' ') {
      i++;
    }

    let start = i;
    readValue(); // property index

    // read conditions (up to the last segment)
    let last = i;
    while (i < s.length && s[i] !== ' ' && s[i] !== '-') {
      last = i;
      readValue();
    }

    // skip arbitrary values
    if (s[i] === '-') {
      while (i < s.length && s[i] !== ' ') {
        i++;
      }
    }

    properties.set(s.slice(start, last), s.slice(start, i));
  }

  function readValue() {
    while (i < s.length) {
      if (s[i] === '_') {
        i++;
      } else {
        i++;
        break;
      }
    }
  }

  let res = '';
  for (let v of properties.values()) {
    res += ' ' + v;
  }

  return res;
}
