import { Optional } from '../types'
import { Object, Error } from './object'

export default class Environment {
  constructor(public outer: Optional<Environment>) { }
  store: Map<string, Object> = new Map()
  get(name: string): Object {
    let val = this.store.get(name)
    let outer = this.outer;
    while (!val && outer) {
      val = outer.get(name);
      outer = outer.outer;
    }
    if (!val) {
      return new Error(`identifier not found: ${name}`)
    }
    return val;
  }
  set(name: string, value: Object): Object {
    this.store.set(name, value)
    return value
  }
}

