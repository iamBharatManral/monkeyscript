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
  constructor(public name: Identifier, public value: Expression) { }
  toString(): string {
    return `let ${this.name} = ${this.value.toString()}`
  }
}

export class ReturnStatment implements Statement {
  constructor(public value: Expression) { }
  toString(): string {
    return `return ${this.value.toString()}`
  }
}

export class ExpressionStatement implements Statement {
  constructor(public expression: Expression) { }
  toString(): string {
    return `${this.expression.toString()}`
  }
}

export class BlockStatement implements Statement {
  constructor(public statements: Array<Statement>) { }
  toString(): string {
    return `${this.statements.toString()}`
  }
}

// Expressions

export class Identifier implements Expression {
  constructor(public value: string) { }
  toString(): string {
    return `${this.value}`
  }
}

export class BooleanLiternal extends Expression {
  constructor(public value: boolean) { super() }
  toString(): string {
    return `${this.value}`
  }
}

export class IntegerLiteral extends Expression {
  constructor(public value: number) { super() }
  toString(): string {
    return `${this.value}`
  }
}

export class StringLiteral extends Expression {
  constructor(public value: string) { super() }
  toString(): string {
    return `${this.value}`
  }
}

export class PrefixExpression extends Expression {
  constructor(public operator: string, public right: Expression) { super() }
  toString(): string {
    return `${this.operator}${this.right.toString()}`
  }
}

export class InfixExpression extends Expression {
  constructor(public left: Expression, public operator: string, public right: Expression) { super() }
  toString(): string {
    return `${this.left.toString()} ${this.operator} ${this.right.toString()}`
  }
}

export class IfExpression extends Expression {
  constructor(public condition: Expression, public consequence: BlockStatement, public alternative: Optional<BlockStatement>) { super() }
  toString(): string {
    return `if ( ${this.condition.toString()} ) { ${this.consequence?.toString()} } else { ${this.alternative?.toString()} }`
  }
}

export class FunctionLiteral extends Expression {
  constructor(public parameters: Array<Identifier>, public body: BlockStatement) { super() }
  toString(): string {
    return `fn ( ${this.parameters.toString()} ) { ${this.body?.toString()} }`
  }
}

export class CallExpression extends Expression {
  constructor(public fn: Expression, public args: Array<Expression>) { super() }
  toString(): string {
    return `${this.fn.toString()} ( ${this.args.toString()} )`
  }
}
