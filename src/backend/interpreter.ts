import { BlockStatement, BooleanLiternal, CallExpression, Expression, ExpressionStatement, FunctionLiteral, Identifier, IfExpression, InfixExpression, IntegerLiteral, LetStatement, Node, PrefixExpression, Program, ReturnStatment, Statement } from '../frontend/ast'
import { identifierNotFoundError, unknowOpError } from '../frontend/error'
import { Optional } from '../types'
import Environment from './environment'
import { IntegerO, NullO, MObject, BooleanO, ObjectType, ReturnO, ErrorO, FunctionO } from './object'

const TRUE = new BooleanO(true)
const FALSE = new BooleanO(false)
const NULL = new NullO()

export default class Interpreter {
  constructor() { }

  eval(ast: Node, env: Environment): MObject {
    switch (true) {
      case ast instanceof Program:
        return this.evalProgram((ast as Program).statements, env);
      case ast instanceof ExpressionStatement:
        return this.eval((ast as ExpressionStatement).expression as Expression, env);
      case ast instanceof IntegerLiteral:
        return new IntegerO((ast as IntegerLiteral).value);
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
        return new ReturnO(this.eval(ast.value as Expression, env))
      case ast instanceof LetStatement:
        return this.evalLetStatement(ast, env)
      case ast instanceof Identifier:
        return this.evalIdentifier(ast, env)
      case ast instanceof FunctionLiteral:
        return this.evalFunctionLiteral(ast, env)
      case ast instanceof CallExpression:
        return this.evalCallExpression(ast, env)
      default:
        return NULL;
    }
  }

  evalProgram(stmts: Array<Statement>, env: Environment): MObject {
    let result: MObject = new NullO();
    for (const stmt of stmts) {
      result = this.eval(stmt, env)
      if (result.type() === ObjectType.RETURN_OBJ || result.type() === ObjectType.ERROR_OBJ) {
        return result;
      }
    }
    return result;
  }

  evalPrefixExpresion(op: string, exp: MObject): MObject {
    switch (op) {
      case "!":
        return this.evalBangOperatorExpression(exp)
      case "-":
        return this.evalMinusPrefixOperatorExpression(exp)
      default:
        return unknowOpError(op)
    }
  }

  evalInfixExpression(op: string, left: MObject, right: MObject): MObject {
    switch (true) {
      case left.type() === ObjectType.INTEGER_OBJ || right.type() === ObjectType.INTEGER_OBJ:
        return this.evalIntegerInfixExpression(op, left, right)
      case op === "==":
        return this.nativeBoolToBooleanObject(left == right)
      case op === "!=":
        return this.nativeBoolToBooleanObject(left != right)
      default:
        return unknowOpError(op, left, right)
    }
  }

  evalBlockStatements(block: BlockStatement, env: Environment): MObject {
    let result = NULL;
    for (const stmt of block.statements) {
      result = this.eval(stmt, env)
      if (result.type() === ObjectType.RETURN_OBJ || result.type() === ObjectType.ERROR_OBJ) {
        return result
      }
    }
    return result
  }

  evalIfExpression(cond: MObject, conseq: Node, alter: Optional<Node>, env: Environment): MObject {
    if (this.isTruthy(cond)) {
      return this.eval(conseq, env)
    } else if (alter !== null) {
      return this.eval(alter, env)
    }
    return NULL
  }

  evalLetStatement(ast: LetStatement, env: Environment): MObject {
    const val = this.eval(ast.value as Expression, env)
    if (this.isError(val)) {
      return val
    }
    env.set(ast.name.value, val)
    return NULL
  }

  evalIdentifier(ast: Identifier, env: Environment): MObject {
    const idVal = env.get(ast.value)
    if (!idVal) {
      return identifierNotFoundError(idVal)
    }
    return idVal
  }

  evalFunctionLiteral(ast: FunctionLiteral, env: Environment): MObject {
    return new FunctionO(ast.parameters, ast.body, env)
  }

  evalCallExpression(ast: CallExpression, env: Environment): MObject {
    const func = this.eval(ast.fn, env)
    if (this.isError(func)) {
      return func
    }
    const args = this.evalExpressions(ast.args, env)
    return args.some(arg => this.isError(arg)) ? (args.find(arg => this.isError(arg)) as MObject) : this.applyFunction(func as FunctionO, args)

  }

  applyFunction(func: FunctionO, args: Array<MObject>): MObject {
    if (func.type() !== ObjectType.FUNCTION_OBJ) {
      return new ErrorO(`not a function ${func.type()}`)
    }
    if (func.parameters.length !== args.length) {
      return new ErrorO(`args mismatch: expected: ${func.parameters.length}, got: ${args.length}`)
    }
    const extendedFuncEnv = this.extendFunctionEnv(func as FunctionO, args)
    const val = this.eval((func as FunctionO).body as BlockStatement, extendedFuncEnv)
    return this.unwrapReturnValue(val)
  }

  unwrapReturnValue(val: MObject): MObject {
    if (val.type() === ObjectType.RETURN_OBJ) {
      return (val as ReturnO).value
    }
    return val
  }

  extendFunctionEnv(fn: FunctionO, args: Array<MObject>): Environment {
    const newEnv = new Environment(fn.env)
    for (const idx in fn.parameters) {
      newEnv.set(fn.parameters[idx].value, args[idx])
    }
    return newEnv
  }

  evalExpressions(exps: Array<Expression>, env: Environment): Array<MObject> {
    const result = []
    for (const exp of exps) {
      const expVal = this.eval(exp, env)
      if (this.isError(expVal)) {
        return [expVal]
      }
      result.push(expVal)
    }
    return result
  }

  evalBangOperatorExpression(exp: MObject): MObject {
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
  evalMinusPrefixOperatorExpression(exp: MObject): MObject {
    if (exp.type() !== ObjectType.INTEGER_OBJ) {
      return new ErrorO(`unknown operator: ${exp.type().toString()}`)
    }
    return new IntegerO((exp as IntegerO).value * -1)
  }

  evalIntegerInfixExpression(op: string, left: MObject, right: MObject) {
    const leftValue = (left as IntegerO).value
    const rightValue = (right as IntegerO).value
    switch (op) {
      case "+":
        return new IntegerO(leftValue + rightValue)
      case "-":
        return new IntegerO(leftValue - rightValue)
      case "*":
        return new IntegerO(leftValue * rightValue)
      case "/":
        return new IntegerO(leftValue / rightValue)
      case "%":
        return new IntegerO(leftValue % rightValue)
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
        return unknowOpError(op, left, right)
    }
  }

  isError(obj: MObject): boolean {
    return obj.type() === ObjectType.ERROR_OBJ
  }

  nativeBoolToBooleanObject(val: boolean) {
    return val ? TRUE : FALSE
  }

  isTruthy(obj: MObject): boolean {
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


}
