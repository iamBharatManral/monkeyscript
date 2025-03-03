import { BooleanLiternal, Expression, ExpressionStatement, IntegerLiteral, Node, Program, Statement } from '../frontend/ast'
import { Integer, Null, Object, Boolean } from './object'

export default class Interpreter {
  constructor() { }

  eval(ast: Node): Object {
    switch (true) {
      case ast instanceof Program:
        return this.evalStatements((ast as Program).statements);
      case ast instanceof ExpressionStatement:
        return this.eval((ast as ExpressionStatement).expression as Expression);
      case ast instanceof IntegerLiteral:
        return new Integer((ast as IntegerLiteral).value);
      case ast instanceof BooleanLiternal:
        return new Boolean((ast as BooleanLiternal).value);
      default:
        return new Null();
    }
  }

  evalStatements(stmts: Array<Statement>): Object {
    let result: Object = new Null();
    for (const stmt of stmts) {
      result = this.eval(stmt)
    }
    return result;
  }
}
