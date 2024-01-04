import type {Value, CSSValue, CSSProperties, PropertyFunction, PropertyValueMap, Theme, Condition, VariantMap, StyleFunction, StyleValue, ThemeProperties} from './types';

export function createArbitraryProperty<T extends Value>(fn: (value: T) => CSSProperties): PropertyFunction<T> {
  return (value) => {
    let selector = Array.isArray(value) ? value.map(v => generateArbitraryValueSelector(String(v))).join('') : generateArbitraryValueSelector(String(value));
    return [fn(value), selector];
  };
}

export function createMappedProperty<T extends CSSValue>(fn: (value: string) => CSSProperties, values: PropertyValueMap<T>): PropertyFunction<T> {
  let keys = Object.keys(values);
  return (value) => {
    let v = parseArbitraryValue(value);
    if (v) {
      return [fn(v[0]), v[1]];
    }
    return [fn(values[value]), generateName(keys.indexOf(String(value)))];
  };
}

type Color<C extends string> = C | `${C}/${number}`;
export function createColorProperty<C extends string>(colors: PropertyValueMap<C>, property?: keyof CSSProperties): PropertyFunction<Color<C>> {
  let keys = Object.keys(colors);
  return (value: Color<C>, key: string) => {
    let v = parseArbitraryValue(value);
    if (v) {
      return [{[property || key]: v[0]}, v[1]];
    }

    let [color, opacity] = value.split('/');
    // @ts-ignore
    let c = colors[color];
    let css = opacity ? `rgb(from ${c} r g b / ${opacity}%)` : c;
    let selector = generateName(keys.indexOf(color)) + (opacity ? opacity.replace('.', '-') : '');
    return [{[property || key]: css}, selector];
  };
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
  let themePropertyKeys = Object.keys(theme.properties);
  let themeConditionKeys = Object.keys(theme.conditions);

  return function style(this: MacroContext | void, style) {
    let css = '@layer a';
    for (let i = 0; i < themeConditionKeys.length; i++) {
      css += ', ' + generateName(i + 1);
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
          rules.set(prop, compileValue([], prop, prop, value));
        }
      } else if (themeProperty in theme.properties) {
        rules.set(key, compileValue([], key, themeProperty, value));
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

  function compileValue(conditions: Condition<T>[], property: string, themeProperty: string, value: StyleValue<Value, Condition<T>, any>) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      let rules: Rule[] = [];
      if (value.default != null) {
        rules.push(compileCondition('default', compileValue(conditions, property, themeProperty, value.default)));
      }

      for (let condition in theme.conditions) {
        if (value[condition] != null) {
          let c = conditions.concat(condition);
          rules.push(compileCondition(condition, compileValue(c, property, themeProperty, value[condition]!)));
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
          rules.push(compileCondition(cond, compileValue(conditions, property, themeProperty, val)));
        } else if (typeof val === 'object' && val) {
          let v = val as VariantMap<string, Value, Condition<T>, any>;
          for (let key in v) {
            rules.push(compileCondition(`${cond} === ${JSON.stringify(key)}`, compileValue(conditions, property, themeProperty, v[key]!)));
          }
        }
      }
      return rules;
    } else if (conditions.length === 0) {
      return [{
        prelude: '@layer a',
        body: [compileRule(conditions, property, themeProperty, value)],
        condition: ''
      }]
    } else {
      return [compileRule(conditions, property, themeProperty, value)];
    }
  }

  function compileCondition(condition: string, rules: Rule[]): Rule {
    if (condition === 'default') {
      return {prelude: '', condition: '', body: rules};
    }

    if (condition in theme.conditions) {
      return {
        prelude: `@layer ${generateName(themeConditionKeys.indexOf(condition) + 1)}`,
        body: [{prelude: theme.conditions[condition], body: rules, condition: ''}],
        condition: ''
      };
    }

    return {prelude: '', condition, body: rules};
  }

  function compileRule(conditions: Condition<T>[], property: string, themeProperty: string, value: Value): Rule {
    let prelude = '.';
    if (property.startsWith('--')) {
      prelude += generateArbitraryValueSelector(property, true) + '-';
    } else {
      prelude += generateName(themePropertyKeys.indexOf(themeProperty), true);
    }

    prelude += conditions.map(c => generateName(themeConditionKeys.indexOf(c))).join('');

    let p = property.startsWith('--') ? property : kebab(property);

    let body = '';
    if (themeProperty in theme.properties) {
      let v = theme.properties[themeProperty];
      if (typeof v === 'function') {
        let [obj, p] = v(value, property);
        prelude += p;
        for (let key in obj) {
          // @ts-ignore
          body += `${kebab(key)}: ${obj[key]};`
        }
      } else {
        if (typeof value === 'string' && value.startsWith('--')) {
          prelude += value;
          body = `${p}: var(${value})`;
        } else if (typeof value === 'string' && value[0] === '[' && value[value.length - 1] === ']') {
          prelude += generateArbitraryValueSelector(value.slice(1, -1));
          body = `${p}: ${value.slice(1, -1)}`;
        } else if (Array.isArray(v)) {
          prelude += generateName(v.indexOf(String(value)));
          body = `${p}: ${value}`;
        } else if (typeof value !== 'object') {
          let val = String(value);
          prelude += generateName(Object.keys(v).indexOf(val));
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
