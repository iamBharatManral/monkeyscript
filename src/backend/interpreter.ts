import { BooleanLiternal, Expression, ExpressionStatement, InfixExpression, IntegerLiteral, Node, PrefixExpression, Program, Statement } from '../frontend/ast'
import { Integer, Null, Object, Boolean, ObjectType } from './object'

const TRUE = new Boolean(true)
const FALSE = new Boolean(false)
const NULL = new Null()

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
        return this.nativeBoolToBooleanObject(ast.value)
      case ast instanceof PrefixExpression:
        return this.evalPrefixExpresion(ast.operator, this.eval(ast.right))
      default:
        return NULL;
    }
  }

  nativeBoolToBooleanObject(val: boolean) {
    return val ? TRUE : FALSE
  }

  evalStatements(stmts: Array<Statement>): Object {
    let result: Object = new Null();
    for (const stmt of stmts) {
      result = this.eval(stmt)
    }
    return result;
  }

  evalPrefixExpresion(op: string, exp: Object): Object {
    switch (op) {
      case "!":
        return this.evalBangOperatorExpression(exp)
      case "-":
        return this.evalMinusPrefixOperatorExpression(exp)
      default:
        return NULL
    }
  }

  evalBangOperatorExpression(exp: Object): Object {
    switch (exp) {
      case TRUE:
        return FALSE
      case FALSE:
        return TRUE
      case NULL:
        return TRUE
      default:
        return FALSE
    }
  }
  evalMinusPrefixOperatorExpression(exp: Object): Object {
    if (exp.type() !== ObjectType.INTEGER_OBJ) {
      return NULL
    }
    return new Integer((exp as Integer).value * -1)
  }
}
