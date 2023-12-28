import type * as CSS from 'csstype';

type CSSValue = string | number;
type CustomValue = string | number | boolean;
type Value = CustomValue | CustomValue[];
type PropertyValueMap<T extends CSSValue = CSSValue> = {
  [name in T]: string
};

interface PropertyFunction<T extends Value> {
  (value: CSSValue): CSS.Properties,
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
        : IsUnion<Keys<R>, {[k in R[name]]?: StyleValue<V, C, R>}, StyleValue<V, C, R>>
};

type RecursiveConditions<B extends string, C extends Conditional<any, any, any>> = {
  [Name in keyof C]:
    Name extends B
      ? never
      : C[Name] extends Conditional<any, any, any>
        ? Name | RecursiveConditions<B, C[Name]>
        : Name
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
type RuntimeStyleFunction<R> = (props: R) => string;
type StyleFunction<T extends Theme> = <R extends RenderProps<string>, S extends Style<T, R> = Style<T, R>>(style: S) => RuntimeStyleFunction<InferProps<Condition<T>, S, R>>;

export function property<T extends Value>(fn: (value: T) => CSS.Properties): PropertyFunction<T>
export function property<T extends CSSValue>(fn: (value: string) => CSS.Properties, values: PropertyValueMap<T>): PropertyFunction<T>
export function property<T extends CSSValue>(fn: (value: string) => CSS.Properties, values?: PropertyValueMap<T>): PropertyFunction<T> {
  let f = fn as PropertyFunction<T>;
  if (values) {
    let keys = Object.keys(values);
    f.getValue = (value) => [values[value], generateName(keys.indexOf(String(value)))];
  } else {
    f.getValue = (value) => {
      let v = Array.isArray(value) ? value.map(v => generateArbitraryValueSelector(String(v))).join('') : generateArbitraryValueSelector(String(value));
      return [value, v];
    };
  }
  return f;
}

function generateArbitraryValueSelector(v: string) {
  return '-' + [...v].map(c => generateName(c.charCodeAt(0))).join('');
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
        let val = value[cond];
        if (typeof val == 'object' && val) {
          for (let key in theme.conditions) {
            if (key in value && !(key in val)) {
              val[key] = value[key];
              // console.log(key, value[key])
            }
          }
        }
        if (cond.startsWith('is')) {
          rules.push(compileCondition(cond, compileValue(conditions, property, value[cond]!)));
        } else if (typeof val === 'object' && val) {
          for (let key in val) {
            rules.push(compileCondition(`${cond} === ${JSON.stringify(key)}`, compileValue(conditions, property, value[cond]![key]!)));
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
    // let prelude = `.${appendPrefix(conditions.join('-'), property)}-${value}`;
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
          let obj = v(val);
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

function appendPrefix(prefix: string, value: string) {
  if (value === 'default') {
    return prefix;
  }

  return (prefix ? prefix + '-' : '') + value;
}

function generateName(index: number, atStart = false) {
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
      res = '-' + res;
    }
    return res;
  }

  return '_' + generateName(index - 62);
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

// taken from: https://stackoverflow.com/questions/51603250/typescript-3-parameter-list-intersection-type/51604379#51604379
type ArgTypes<T> = T extends (props: infer V) => any ? V : never;
type BoxedTupleTypes<T extends any[]> = { [P in keyof T]: [ArgTypes<T[P]>] }[Exclude<keyof T, keyof any[]>];
type UnboxIntersection<T> = T extends { 0: infer U } ? U : never;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export function merge<T extends RuntimeStyleFunction<any>[]>(...args: T): RuntimeStyleFunction<UnboxIntersection<UnionToIntersection<BoxedTupleTypes<T>>>> {
  return (props) => {
    return dedupe(args.map(f => f(props)).join(''));
  };
}

function dedupe(s: string) {
  let properties = new Map<string, string>();
  let i = 0;
  while (i < s.length) {
    while (i < s.length && s[i] === ' ') {
      i++;
    }

    if (s[i] === '-') {
      i++
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
