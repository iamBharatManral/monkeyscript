export enum ObjectType {
  INTEGER_OBJ = "INTEGER",
  BOOLEAN_OBJ = "BOOLEAN",
  RETURN_OBJ = "RETURN_VALUE",
  NULL_OBJ = "NULL"
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

