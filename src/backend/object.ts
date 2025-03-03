export enum ObjectType {
  INTEGER_OBJ = "INTEGER",
  BOOLEAN_OBJ = "BOOLEAN",
  NULL_OBJ = "NULL"
}

export interface Object {
  type(): ObjectType
  inspect(): string
}

export class Integer implements Object {
  constructor(private value: number) { }
  type(): ObjectType { return ObjectType.INTEGER_OBJ }
  inspect(): string { return `${this.value}` }
}

export class Boolean implements Object {
  constructor(private value: number) { }
  type(): ObjectType { return ObjectType.BOOLEAN_OBJ }
  inspect(): string { return `${this.value}` }
}

export class Null implements Object {
  type(): ObjectType { return ObjectType.NULL_OBJ }
  inspect(): string { return "null" }
}

