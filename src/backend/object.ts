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
  ERROR_OBJ = "ERROR_MESSAGE",
  BUILTIN_FN = "BUILTIN"
}

export interface MObject {
  type(): ObjectType
  inspect(): string
}

export class IntegerO implements MObject {
  constructor(public value: number) { }
  type(): ObjectType { return ObjectType.INTEGER_OBJ }
  inspect(): string { return `${this.value}` }
}

export class BooleanO implements MObject {
  constructor(public value: boolean) { }
  type(): ObjectType { return ObjectType.BOOLEAN_OBJ }
  inspect(): string { return `${this.value}` }
}

export class StringO implements MObject {
  constructor(public value: string) { }
  type(): ObjectType { return ObjectType.STRING_OBJ }
  inspect(): string { return this.value }
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
