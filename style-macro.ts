// type PropertyFunction = (value: any) => string;
//

interface PropertyValueMap {
  [name: string | number]: string
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
  [Name in keyof T['properties']]?: StyleValue<(keyof T['properties'][Name] & (string | number)) | `--${string}`, T>
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
    // console.log(css)
    // console.log(js);

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
          rules.push(compileCondition(condition, compileValue(c, property, value[condition]!)));
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
    let prelude = '.' + conditions.map((c, i) => generateName(themeConditionKeys.indexOf(c), i === 0)).join('') + generateName(themePropertyKeys.indexOf(property), conditions.length === 0);
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
      res = '_' + res;
    }
    return res;
  }

  if (index === 62) {
    return '-';
  }

  return '_' + generateName(index - 62);

  console.log(index)
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
