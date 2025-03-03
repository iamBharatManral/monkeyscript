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

  test('test eval of prefix expression', () => {
    const tests = [
      {
        input: "!true",
        output: "false"
      },
      {
        input: "!false",
        output: "true"
      },
      {
        input: "!5",
        output: "false"
      },
      {
        input: "!!true",
        output: "true"
      },
      {
        input: "!!false",
        output: "false"
      },
      {
        input: "!!5",
        output: "true"
      },
      {
        input: "-5",
        output: "-5"
      },
    ]
    for (const input of tests) {
      const lexer = new Lexer(input.input)
      const parser = new Parser(lexer)
      const pg = parser.parse()
      const interpreter = new Interpreter()
      const result = interpreter.eval(pg)
      assert.deepStrictEqual(result.inspect(), input.output)

    }
  })
})

