import { BlockStatement, Identifier } from "../frontend/ast"
import { Optional } from "../types"
import Environment from "./environment"

type BuiltinFunc = (...args: Array<MObject>) => MObject

export enum ObjectType {
  INTEGER_OBJ = "INTEGER",
  BOOLEAN_OBJ = "BOOLEAN",
  RETURN_OBJ = "RETURN_VALUE",
  FUNCTION_OBJ = "FUNCTION",
  STRING_OBJ = "STRING",
  NULL_OBJ = "NULL",
  ARRAY_OBJ = "ARRAY",
  HASH_OBJ = "HASH",
  ERROR_OBJ = "ERROR_MESSAGE",
  BUILTIN_FN = "BUILTIN"
}

export interface MObject {
  type(): ObjectType
  inspect(): string
}

export interface Hashable {
  hashKey(): any
}

export class IntegerO implements MObject, Hashable {
  constructor(public value: number) { }
  type(): ObjectType { return ObjectType.INTEGER_OBJ }
  inspect(): string { return `${this.value}` }
  hashKey(): number { return this.value }
}

export class BooleanO implements MObject, Hashable {
  constructor(public value: boolean) { }
  type(): ObjectType { return ObjectType.BOOLEAN_OBJ }
  inspect(): string { return `${this.value}` }
  hashKey(): boolean { return this.value }
}

export class StringO implements MObject, Hashable {
  constructor(public value: string) { }
  type(): ObjectType { return ObjectType.STRING_OBJ }
  inspect(): string { return this.value }
  hashKey(): string { return this.value }
}

export class NullO implements MObject {
  type(): ObjectType { return ObjectType.NULL_OBJ }
  inspect(): string { return "null" }
}

export class ReturnO implements MObject {
  constructor(public value: MObject) { }
  type(): ObjectType { return ObjectType.RETURN_OBJ }
  inspect(): string { return this.value.inspect() }
}

export class ErrorO implements MObject {
  constructor(public message: string) { }
  type(): ObjectType { return ObjectType.ERROR_OBJ }
  inspect(): string { return this.message }
}

export class FunctionO implements MObject {
  constructor(public parameters: Array<Identifier>, public body: Optional<BlockStatement>, public env: Environment) { }
  type(): ObjectType { return ObjectType.FUNCTION_OBJ }
  inspect(): string { return ObjectType.FUNCTION_OBJ }
}

export class BuiltinFunctionO implements MObject {
  constructor(public fn: BuiltinFunc) { }
  type(): ObjectType { return ObjectType.BUILTIN_FN }
  inspect(): string { return `builtin function` }
}

export class ArrayO implements MObject {
  constructor(public elements: Array<MObject>) { }
  type(): ObjectType { return ObjectType.ARRAY_OBJ }
  inspect(): string { return `[${this.elements.map(obj => obj.inspect()).join(', ')}]` }
}

export class HashO implements MObject {
  constructor(public pairs: Map<any, MObject>) { }

  type(): ObjectType { return ObjectType.HASH_OBJ }
  inspect(): string { return `{ "hash" }` }

  set(key: any, value: MObject) {
    this.pairs.set(key, value);
  }

  get(key: any) {
    return this.pairs.get(key);
  }

  has(key: any) {
    return this.pairs.has(key)
  }
}
