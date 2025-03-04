import { BlockStatement, BooleanLiternal, Expression, ExpressionStatement, Identifier, IfExpression, InfixExpression, IntegerLiteral, LetStatement, Node, PrefixExpression, Program, ReturnStatment, Statement } from '../frontend/ast'
import { Optional } from '../types'
import Environment from './environment'
import { Integer, Null, Object, Boolean, ObjectType, Return, Error } from './object'

const TRUE = new Boolean(true)
const FALSE = new Boolean(false)
const NULL = new Null()
const IDENTIFIER_NOT_FOUND = (id: string) => new Error(`identifier not found: ${id}`)

export default class Interpreter {
  constructor() { }

  eval(ast: Node, env: Environment): Object {
    switch (true) {
      case ast instanceof Program:
        return this.evalProgram((ast as Program).statements, env);
      case ast instanceof ExpressionStatement:
        return this.eval((ast as ExpressionStatement).expression as Expression, env);
      case ast instanceof IntegerLiteral:
        return new Integer((ast as IntegerLiteral).value);
      case ast instanceof BooleanLiternal:
        return this.nativeBoolToBooleanObject(ast.value)
      case ast instanceof PrefixExpression:
        return this.evalPrefixExpresion(ast.operator, this.eval(ast.right, env))
      case ast instanceof InfixExpression:
        return this.evalInfixExpression(ast.operator, this.eval(ast.left, env), this.eval(ast.right, env))
      case ast instanceof BlockStatement:
        return this.evalBlockStatements(ast, env)
      case ast instanceof IfExpression:
        return this.evalIfExpression(this.eval(ast.condition, env), ast.consequence as BlockStatement, ast.alternative, env)
      case ast instanceof ReturnStatment:
        return new Return(this.eval(ast.value as Expression, env))
      case ast instanceof LetStatement:
        return this.evalLetStatement(ast, env)
      case ast instanceof Identifier:
        return this.evalIdentifier(ast, env)
      default:
        return NULL;
    }
  }

  isError(obj: Object): boolean {
    return obj.type() === ObjectType.ERROR_OBJ
  }

  evalLetStatement(ast: LetStatement, env: Environment): Object {
    const val = this.eval(ast.value as Expression, env)
    if (this.isError(val)) {
      return val
    }
    env.set(ast.name.value, val)
    return val
  }

  evalIdentifier(ast: Identifier, env: Environment): Object {
    const idVal = env.get(ast.value)
    if (!idVal) {
      return IDENTIFIER_NOT_FOUND(ast.value)
    }
    return idVal
  }

  evalBlockStatements(block: BlockStatement, env: Environment): Object {
    let result = NULL;
    for (const stmt of block.statements) {
      result = this.eval(stmt, env)
      if (result.type() === ObjectType.RETURN_OBJ || result.type() === ObjectType.ERROR_OBJ) {
        return result
      }
    }
    return result
  }

  nativeBoolToBooleanObject(val: boolean) {
    return val ? TRUE : FALSE
  }

  evalProgram(stmts: Array<Statement>, env: Environment): Object {
    let result: Object = new Null();
    for (const stmt of stmts) {
      result = this.eval(stmt, env)
      if (result.type() === ObjectType.RETURN_OBJ || result.type() === ObjectType.ERROR_OBJ) {
        return result;
      }
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
        return new Error(`unknown operator: ${op}`)
    }
  }

  evalIfExpression(cond: Object, conseq: Node, alter: Optional<Node>, env: Environment): Object {
    if (this.isTruthy(cond)) {
      return this.eval(conseq, env)
    } else if (alter !== null) {
      return this.eval(alter, env)
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
      return new Error(`unknown operator: ${exp.type().toString()}`)
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
        return new Error(`unkown operator: ${left.type()} ${op} ${right.type()}`)
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
        return new Error(`unkown operator: ${left.type()} ${op} ${right.type()}`)
    }
  }
}
