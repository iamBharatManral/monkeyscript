import { BlockStatement, Identifier } from "../frontend/ast"
import { Optional } from "../types"
import Environment from "./environment"

export enum ObjectType {
  INTEGER_OBJ = "INTEGER",
  BOOLEAN_OBJ = "BOOLEAN",
  RETURN_OBJ = "RETURN_VALUE",
  FUNCTION_OBJ = "FUNCTION",
  NULL_OBJ = "NULL",
  ERROR_OBJ = "ERROR_MESSAGE"
}

export interface Object {
  type(): ObjectType
  inspect(): string
}

export class Integer implements Object {
  constructor(public value: number) { }
  type(): ObjectType { return ObjectType.INTEGER_OBJ }
  inspect(): string { return `${this.value}` }
}

export class Boolean implements Object {
  constructor(public value: boolean) { }
  type(): ObjectType { return ObjectType.BOOLEAN_OBJ }
  inspect(): string { return `${this.value}` }
}

export class Null implements Object {
  type(): ObjectType { return ObjectType.NULL_OBJ }
  inspect(): string { return "null" }
}

export class Return implements Object {
  constructor(public value: Object) { }
  type(): ObjectType { return ObjectType.RETURN_OBJ }
  inspect(): string { return this.value.inspect() }
}

export class Error implements Object {
  constructor(public message: string) { }
  type(): ObjectType { return ObjectType.ERROR_OBJ }
  inspect(): string { return this.message }
}

export class Function implements Object {
  constructor(public parameters: Array<Identifier>, public body: Optional<BlockStatement>, public env: Environment) { }
  type(): ObjectType { return ObjectType.FUNCTION_OBJ }
  inspect(): string { return ObjectType.FUNCTION_OBJ }
}
