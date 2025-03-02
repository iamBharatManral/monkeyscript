import { Optional } from '../types'


export type infixFunc = (exp: Optional<Expression>) => Optional<Expression>
export type prefixFunc = () => Optional<Expression>

export interface Node { }

export class Statement implements Node {
}

export class Expression implements Node {
}

export class Program implements Node {
  constructor(public statements: Array<Statement>) { }
}

// Statements
export class LetStatement implements Statement {
  constructor(public name: Identifier, public value: Optional<Expression>) { }
}

export class ReturnStatment implements Statement {
  constructor(public value: Optional<Expression>) { }
}

export class ExpressionStatement implements Statement {
  constructor(public expression: Optional<Expression>) { }
}

export class BlockStatement implements Statement {
  constructor(public statements: Array<Statement>) { }
}

// Expressions

export class Identifier implements Expression {
  constructor(public value: string) { }
}

export class BooleanLiternal extends Expression {
  constructor(public value: boolean) { super() }
}

export class IntegerLiteral extends Expression {
  constructor(public value: number) { super() }
}

export class PrefixExpression extends Expression {
  constructor(public operator: string, public right: Expression) { super() }
}

export class InfixExpression extends Expression {
  constructor(public left: Expression, public operator: string, public right: Expression) { super() }
}

export class IfExpression extends Expression {
  constructor(public condition: Expression, private consequence: Optional<BlockStatement>, private alternative: Optional<BlockStatement>) { super() }
}

export class FunctionLiteral extends Expression {
  constructor(public parameters: Array<Identifier>, body: Optional<BlockStatement>) { super() }
}
