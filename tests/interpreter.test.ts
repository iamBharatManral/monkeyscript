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

  test('test eval of infix expression', () => {
    const tests = [
      {
        input: "5 + 5 + 5 + 5 - 10",
        output: "10"
      },
      {
        input: "2 * 2 * 2 * 2 * 2",
        output: "32"
      },
      {
        input: "-50 + 100 + -50",
        output: "0"
      },
      {
        input: "5 * 2 + 10",
        output: "20"
      },
      {
        input: "5 + 2 * 10",
        output: "25"
      },
      {
        input: "20 + 2 * -10",
        output: "0"
      },
      {
        input: "50 / 2 * 2 + 10",
        output: "60"
      },
      {
        input: "2 * (5 + 10)",
        output: "30"
      },
      {
        input: "3 * 3 * 3 + 10",
        output: "37"
      },
      {
        input: "3 * (3 * 3) + 10",
        output: "37"
      },
      {
        input: "(5 + 10 * 2 + 15 / 3) * 2 + -10",
        output: "50"
      },
      {
        input: "1 < 2",
        output: "true"
      },
      {
        input: "1 > 2",
        output: "false"
      },
      {
        input: "1 == 1",
        output: "true"
      },
      {
        input: "1 != 3",
        output: "true"
      },
      {
        input: "1 <= 1",
        output: "true"
      },
      {
        input: "1 >= 3",
        output: "false"
      },
      {
        input: "true == true",
        output: "true"
      },
      {
        input: "(1 >= 3)",
        output: "false"
      },
      {
        input: "(1 < 2) == true",
        output: "true"
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

  test('test eval of if expression', () => {
    const tests = [
      {
        input: "if (true) { 10 }",
        output: "10"
      },
      {
        input: "if (false) { 10 }",
        output: "null"
      },
      {
        input: "if (1) { 10 }",
        output: "10"
      },
      {
        input: "if (1 < 2) { 10 }",
        output: "10"
      },
      {
        input: "if (1 > 2) { 10 }",
        output: "null"
      },
      {
        input: "if (1 > 2) { 10 } else { 20 }",
        output: "20"
      },
      {
        input: "if (1 < 2) { 10 } else { 20 }",
        output: "10"
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

  test('test eval of return stmt', () => {
    const tests = [
      {
        input: "return 10;",
        output: "10"
      },
      {
        input: "return 10; 9;",
        output: "10"
      },
      {
        input: "return 2 * 5; 9;",
        output: "10"
      },
      {
        input: "9; return 2 * 5; 9;",
        output: "10"
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

