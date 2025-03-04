import { Optional } from '../types'
import { MObject } from './object'

export default class Environment {
  constructor(public outer: Optional<Environment>) { }
  store: Map<string, MObject> = new Map()
  get(name: string): Optional<MObject> {
    let val = this.store.get(name) || null
    let outer = this.outer;
    while (!val && outer) {
      val = outer.get(name);
      outer = outer.outer;
    }
    return val;
  }
  set(name: string, value: MObject): MObject {
    this.store.set(name, value)
    return value
  }
}

