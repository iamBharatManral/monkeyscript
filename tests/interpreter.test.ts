import Lexer from "../src/frontend/lexer"
import Parser from "../src/frontend/parser"
import Interpreter from '../src/backend/interpreter'
import assert from 'assert'

describe('testing interpreter', () => {
  test('test eval of integer expression', () => {
    const input = `5;`
    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const pg = parser.parse()
    const interpreter = new Interpreter()
    const result = interpreter.eval(pg)
    assert.deepStrictEqual(result.inspect(), "5")
  })

  test('test eval of boolean expression', () => {
    const input = `true;`
    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const pg = parser.parse()
    const interpreter = new Interpreter()
    const result = interpreter.eval(pg)
    assert.deepStrictEqual(result.inspect(), "true")
  })
})

