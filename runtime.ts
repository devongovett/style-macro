import {RuntimeStyleFunction, RenderProps, UnionToIntersection} from './types';

// taken from: https://stackoverflow.com/questions/51603250/typescript-3-parameter-list-intersection-type/51604379#51604379
type ArgTypes<T> = T extends (props: infer V) => any ? NullToObject<V> : never;
type NullToObject<T> = T extends (null | undefined) ? {} : T;
type BoxedTupleTypes<T extends any[]> = { [P in keyof T]: [ArgTypes<T[P]>] }[Exclude<keyof T, keyof any[]>];
type UnboxIntersection<T> = T extends { 0: infer U } ? U : never;
type Arg<R> = RuntimeStyleFunction<R> | null | undefined;
type NoInfer<T> = [T, void][T extends any ? 0 : 1];

// Two overloads:
// 1. If a render props type is expected based on the return type, forward that type to all arguments.
// 2. Otherwise, infer the return type based on the arguments.
export function merge<R extends RenderProps<string> = never>(...args: Arg<NoInfer<R>>[]): RuntimeStyleFunction<R>;
export function merge<T extends Arg<any>[]>(...args: T): RuntimeStyleFunction<UnboxIntersection<UnionToIntersection<BoxedTupleTypes<T>>>>;
export function merge(...args: any[]): RuntimeStyleFunction<any> {
  return (props) => {
    let map = new Map();
    for (let f of args) {
      if (typeof f === 'function') {
        for (let [k, v] of parse(f(props))) {
          map.set(k, v);
        }
      }
    }
    
    let res = '';
    for (let value of map.values()) {
      res += value;
    }
    return res;
  };
}

function parse(s: string) {
  let properties = new Map<string, string>();
  let i = 0;
  while (i < s.length) {
    while (i < s.length && s[i] === ' ') {
      i++;
    }

    let start = i;
    readValue(); // property index

    // read conditions (up to the last segment)
    let condition = i;
    let value = i;
    while (i < s.length && s[i] !== ' ') {
      value = i;
      readValue();
    }

    let property = s.slice(start, condition);
    properties.set(property, (properties.get(property) || '') + ' ' + s.slice(start, i));
  }

  function readValue() {
    if (s[i] === '-') {
      // the beginning and end of arbitrary values are marked with -
      while (i < s.length && s[i] !== ' ') {
        i++;
        if (s[i] === '-') {
          i++;
          break;
        }
      }
    } else {
      while (i < s.length) {
        if (s[i] === '_') {
          i++;
        } else {
          i++;
          break;
        }
      }
    }
  }

  return properties;
}
