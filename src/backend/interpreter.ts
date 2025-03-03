import { BlockStatement, BooleanLiternal, Expression, ExpressionStatement, IfExpression, InfixExpression, IntegerLiteral, Node, PrefixExpression, Program, Statement } from '../frontend/ast'
import { Optional } from '../types'
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
      case ast instanceof InfixExpression:
        return this.evalInfixExpression(ast.operator, this.eval(ast.left), this.eval(ast.right))
      case ast instanceof BlockStatement:
        return this.evalStatements(ast.statements)
      case ast instanceof IfExpression:
        return this.evalIfExpression(this.eval(ast.condition), ast.consequence as BlockStatement, ast.alternative)
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

  evalIfExpression(cond: Object, conseq: Node, alter: Optional<Node>): Object {
    if (this.isTruthy(cond)) {
      return this.eval(conseq)
    } else if (alter !== null) {
      return this.eval(alter)
    }
    return NULL
  }

  isTruthy(obj: Object): boolean {
    switch (obj) {
      case NULL:
        return false
      case TRUE:
        return true
      case FALSE:
        return false
      default:
        return true
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

  evalInfixExpression(op: string, left: Object, right: Object): Object {
    switch (true) {
      case left.type() === ObjectType.INTEGER_OBJ || right.type() === ObjectType.INTEGER_OBJ:
        return this.evalIntegerInfixExpression(op, left, right)
      case op === "==":
        return this.nativeBoolToBooleanObject(left == right)
      case op === "!=":
        return this.nativeBoolToBooleanObject(left != right)
      default:
        return NULL
    }
  }

  evalIntegerInfixExpression(op: string, left: Object, right: Object) {
    const leftValue = (left as Integer).value
    const rightValue = (right as Integer).value
    switch (op) {
      case "+":
        return new Integer(leftValue + rightValue)
      case "-":
        return new Integer(leftValue - rightValue)
      case "*":
        return new Integer(leftValue * rightValue)
      case "/":
        return new Integer(leftValue / rightValue)
      case "%":
        return new Integer(leftValue % rightValue)
      case "<":
        return this.nativeBoolToBooleanObject(leftValue < rightValue)
      case "<=":
        return this.nativeBoolToBooleanObject(leftValue <= rightValue)
      case ">":
        return this.nativeBoolToBooleanObject(leftValue > rightValue)
      case ">=":
        return this.nativeBoolToBooleanObject(leftValue >= rightValue)
      case "==":
        return this.nativeBoolToBooleanObject(leftValue == rightValue)
      case "!=":
        return this.nativeBoolToBooleanObject(leftValue != rightValue)
      default:
        return NULL
    }
  }
}
