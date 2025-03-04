import { identifierNotFoundError } from '../frontend/error';
import { Optional } from '../types'
import { MObject, ErrorO } from './object'

export default class Environment {
  constructor(public outer: Optional<Environment>) { }
  store: Map<string, MObject> = new Map()
  get(name: string): MObject {
    let val = this.store.get(name)
    let outer = this.outer;
    while (!val && outer) {
      val = outer.get(name);
      outer = outer.outer;
    }
    if (!val) {
      return identifierNotFoundError(name)
    }
    return val;
  }
  set(name: string, value: MObject): MObject {
    this.store.set(name, value)
    return value
  }
}

