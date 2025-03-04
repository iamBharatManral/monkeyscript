import { Object, Error } from './object'

export default class Environment {
  store: Map<string, Object> = new Map()
  get(name: string): Object {
    const val = this.store.get(name)
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
