import type {Value, CSSValue, CSSProperties, PropertyFunction, PropertyValueMap, Theme, Condition, VariantMap, StyleFunction, StyleValue, ThemeProperties} from './types';

export function createArbitraryProperty<T extends Value>(fn: (value: T) => CSSProperties): PropertyFunction<T> {
  return (value) => {
    let selector = Array.isArray(value) ? value.map(v => generateArbitraryValueSelector(String(v))).join('') : generateArbitraryValueSelector(String(value));
    return {default: [fn(value), selector]};
  };
}

export function createMappedProperty<T extends CSSValue>(fn: (value: string) => CSSProperties, values: PropertyValueMap<T> | string[]): PropertyFunction<Value> {
  let valueMap = createValueLookup(Array.isArray(values) ? values : Object.values(values));
  return (value) => {
    let v = parseArbitraryValue(value);
    if (v) {
      return {default: [fn(v[0]), v[1]]};
    }

    // @ts-ignore
    let val = Array.isArray(values) ? value : values[String(value)];
    let p = valueMap.get(val)!;
    if (typeof val !== 'object') {
      val = {default: val};
    }
    let res: ReturnType<PropertyFunction<T>> = {};
    for (let condition in val) {
      res[condition] = [fn(val[condition] as any), p];
    }
    return res;
  };
}

type Color<C extends string> = C | `${C}/${number}`;
export function createColorProperty<C extends string>(colors: PropertyValueMap<C>, property?: keyof CSSProperties): PropertyFunction<Color<C>> {
  let valueMap = createValueLookup(Object.values(colors))
  return (value: Color<C>, key: string) => {
    let v = parseArbitraryValue(value);
    if (v) {
      return {default: [{[property || key]: v[0]}, v[1]]};
    }

    let [color, opacity] = value.split('/');
    let selector = valueMap.get((colors as any)[color])! + (opacity ? opacity.replace('.', '-') : '');
    // @ts-ignore
    let c = colors[color];
    if (typeof c !== 'object') {
      c = {default: c};
    }
    let res: ReturnType<PropertyFunction<any>> = {};
    for (let condition in c) {
      let css = opacity ? `rgb(from ${c[condition]} r g b / ${opacity}%)` : c[condition];
      res[condition] = [{[property || key]: css}, selector];
    }
    return res;
  };
}

function createValueLookup(values: Array<CSSValue>, atStart = false) {
  let map = new Map<CSSValue, string>();
  for (let value of values) {
    if (!map.has(value)) {
      map.set(value, generateName(map.size, atStart));
    }
  }
  return map;
}

function parseArbitraryValue(value: any) {
  if (typeof value === 'string' && value.startsWith('--')) {
    return [`var(${value})`, value];
  } else if (typeof value === 'string' && value[0] === '[' && value[value.length - 1] === ']') {
    let s = generateArbitraryValueSelector(value.slice(1, -1));
    return [value.slice(1, -1), s];
  }
}

interface MacroContext {
  addAsset(asset: {type: string, content: string}): void
}

export function createTheme<T extends Theme>(theme: T): StyleFunction<ThemeProperties<T>, Condition<T>> {
  let themePropertyMap = createValueLookup(Object.keys(theme.properties), true);
  let themeConditionMap = createValueLookup(['default', ...Object.values(theme.conditions)]);
  let propertyFunctions = new Map(Object.entries(theme.properties).map(([k, v]) => {
    if (typeof v === 'function') {
      return [k, v];
    }
    return [k, createMappedProperty(value => ({[k]: value}), v)];
  }));

  return function style(this: MacroContext | void, style) {
    let css = '@layer ';
    let first = true;
    for (let name of themeConditionMap.values()) {
      if (first) {
        first = false;
      } else {
        css += ', ';
      }
      css += name;
    }
    css += ';\n\n';

    let rules = new Map();
    for (let key in style) {
      let value = style[key]!;
      let themeProperty = key;
      if (key.startsWith('--')) {
        themeProperty = value.type;
        value = value.value;
      }
      if (theme.shorthands[key]) {
        for (let prop of theme.shorthands[key]) {
          rules.set(prop, compileValue(new Set(), prop, prop, value));
        }
      } else if (themeProperty in theme.properties) {
        rules.set(key, compileValue(new Set(), key, themeProperty, value));
      }
    }

    let js = 'let rules = "";\n';
    let printedRules = new Set<string>();
    for (let propertyRules of rules.values()) {
      js += printJS(propertyRules) + '\n';
      for (let rule of propertyRules) {
        css += printRule(rule, printedRules) + '\n\n';
      }
    }

    js += 'return rules;';

    if (typeof this?.addAsset === 'function') {
      this.addAsset({
        type: 'css',
        content: css
      });
    }

    return new Function('props', js) as any;
  }

  function compileValue(conditions: Set<Condition<T>>, property: string, themeProperty: string, value: StyleValue<Value, Condition<T>, any>) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      let rules: Rule[] = [];
      if (value.default != null) {
        rules.push(...compileCondition(conditions, 'default', compileValue(conditions, property, themeProperty, value.default)));
      }

      for (let condition in theme.conditions) {
        if (value[condition] != null) {
          rules.push(...compileCondition(conditions, condition, compileValue(new Set([...conditions, condition]), property, themeProperty, value[condition]!)));
        }
      }

      // Runtime conditions.
      for (let condition in value) {
        if (condition === 'default' || condition in theme.conditions) {
          continue;
        }

        let cond = condition as Condition<T>;
        let val = value[cond]!;
        // if (typeof val == 'object' && val) {
        //   for (let key in theme.conditions) {
        //     if (key in value && !(key in val)) {
        //       // @ts-ignore
        //       val[key] = value[key];
        //       // console.log(key, value[key])
        //     }
        //   }
        // }
        if (/^is[A-Z]/.test(cond)) {
          rules.push(...compileCondition(conditions, cond, compileValue(conditions, property, themeProperty, val)));
        } else if (typeof val === 'object' && val) {
          let v = val as VariantMap<string, Value, Condition<T>, any>;
          for (let key in v) {
            rules.push(...compileCondition(conditions, `${cond} === ${JSON.stringify(key)}`, compileValue(conditions, property, themeProperty, v[key]!)));
          }
        }
      }
      return rules;
    } else {
      return compileRule(conditions, property, themeProperty, value);
    }
  }

  function compileCondition(conditions: Set<Condition<T>>, condition: string, rules: Rule[]): Rule[] {
    if (condition === 'default') {
      if (conditions.size === 0) {
        return [{
          prelude: '@layer a',
          body: rules,
          condition: ''
        }];
      }

      return [{prelude: '', condition: '', body: rules}];
    }

    if (condition in theme.conditions) {
      if (conditions.has(condition)) {
        return [{prelude: '', condition: '', body: rules}];
      }
      return [{
        prelude: `@layer ${themeConditionMap.get(theme.conditions[condition])}`,
        body: [{prelude: theme.conditions[condition], body: rules, condition: ''}],
        condition: ''
      }];
    }

    return [{prelude: '', condition, body: rules}];
  }

  function compileRule(conditions: Set<Condition<T>>, property: string, themeProperty: string, value: Value): Rule[] {
    let prelude = '.';
    if (property.startsWith('--')) {
      prelude += generateArbitraryValueSelector(property, true) + '-';
    } else {
      prelude += themePropertyMap.get(themeProperty);
    }

    for (let condition of conditions) {
      prelude += themeConditionMap.get(theme.conditions[condition]);
    }

    let propertyFunction = propertyFunctions.get(themeProperty);
    if (propertyFunction) {
      let res = propertyFunction(value, property);
      let rules: Rule[] = [];
      for (let condition in res) {
        let [obj, p] = res[condition];
        let body = '';
        for (let key in obj) {
          // @ts-ignore
          body += `${kebab(key)}: ${obj[key]};`
        }
        let selector = prelude;
        if (condition in theme.conditions) {
          selector += themeConditionMap.get(theme.conditions[condition]);
        }
        selector += p;
        let rule: Rule = {
          condition: '',
          prelude: selector,
          body
        };
        rules.push(...compileCondition(conditions, condition, [rule]));
      }
      return rules;
    } else {
      throw new Error('Unknown property ' + themeProperty);
    }
  }
}

function kebab(property: string) {
  if (property.startsWith('--')) {
    return property;
  }
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
  if (atStart && /^[0-9]/.test(c)) {
    c = `_${c}`;
  }
  return `-${c}`;
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

export function raw(this: MacroContext | void, css: string) {
  let className = generateArbitraryValueSelector(css, true);
  css = `.${className} {
  ${css}
}`;
  if (typeof this?.addAsset === 'function') {
    this.addAsset({
      type: 'css',
      content: css
    });
  }
  return className;
}
