import Lexer from "../src/frontend/lexer"
import Parser from "../src/frontend/parser"
import Interpreter from '../src/backend/interpreter'
import assert from 'assert'
import Environment from "../src/backend/environment"

describe('testing interpreter', () => {
  test('eval of integer expression', () => {
    const input = `5;`
    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const env = new Environment(null)
    const pg = parser.parse()
    const interpreter = new Interpreter()
    const result = interpreter.eval(pg, env)
    assert.deepStrictEqual(result.inspect(), "5")
  })

  test('eval of boolean expression', () => {
    const input = `true;`
    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const pg = parser.parse()
    const env = new Environment(null)
    const interpreter = new Interpreter()
    const result = interpreter.eval(pg, env)
    assert.deepStrictEqual(result.inspect(), "true")
  })

  test('eval of prefix expression', () => {
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
      const env = new Environment(null)
      const interpreter = new Interpreter()
      const result = interpreter.eval(pg, env)
      assert.deepStrictEqual(result.inspect(), input.output)

    }
  })

  test('eval of infix expression', () => {
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
      const env = new Environment(null)
      const interpreter = new Interpreter()
      const result = interpreter.eval(pg, env)
      assert.deepStrictEqual(result.inspect(), input.output)

    }
  })

  test('eval of if expression', () => {
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
      const env = new Environment(null)
      const interpreter = new Interpreter()
      const result = interpreter.eval(pg, env)
      assert.deepStrictEqual(result.inspect(), input.output)

    }
  })

  test('eval of return stmt', () => {
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
      const env = new Environment(null)
      const interpreter = new Interpreter()
      const result = interpreter.eval(pg, env)
      assert.deepStrictEqual(result.inspect(), input.output)

    }
  })

  test('eval of let stmt', () => {
    const tests = [
      {
        input: "let a = 5; a;",
        output: "5"
      },
      {
        input: "let a = 5 * 5; a;",
        output: "25"
      },
      {
        input: "let a = 5; let b = a; b;",
        output: "5"
      },
      {
        input: "let a = 5; let b = a; let c = a + b + 5; c;",
        output: "15"
      },
      {
        input: "a",
        output: "identifier not found: 'a'"
      },
    ]
    for (const input of tests) {
      const lexer = new Lexer(input.input)
      const parser = new Parser(lexer)
      const pg = parser.parse()
      const env = new Environment(null)
      const interpreter = new Interpreter()
      const result = interpreter.eval(pg, env)
      assert.deepStrictEqual(result.inspect(), input.output)

    }
  })

  test('eval of function call', () => {
    const tests = [
      {
        input: "let identity = fn(x) { x; }; identity(5);",
        output: "5"
      },
      {
        input: "let identity = fn(x) { return x; }; identity(5);",
        output: "5"
      },
      {
        input: "let double = fn(x) { x * 2; }; double(5);",
        output: "10"
      },
      {
        input: "let add = fn(x, y) { x + y; }; add(5, 5);",
        output: "10"
      },
      {
        input: "let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));",
        output: "20"
      },
      {
        input: "fn(x) { x; }(5)",
        output: "5"
      },
    ]
    for (const input of tests) {
      const lexer = new Lexer(input.input)
      const parser = new Parser(lexer)
      const pg = parser.parse()
      const env = new Environment(null)
      const interpreter = new Interpreter()
      const result = interpreter.eval(pg, env)
      assert.deepStrictEqual(result.inspect(), input.output)

    }
  })

  test('eval of string literal', () => {
    const input = `"hellooo";`
    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const pg = parser.parse()
    const env = new Environment(null)
    const interpreter = new Interpreter()
    const result = interpreter.eval(pg, env)
    assert.deepStrictEqual(result.inspect(), "hellooo")
  })

  test('eval of string concatenation', () => {
    const input = `"hellooo" + " world";`
    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const pg = parser.parse()
    const env = new Environment(null)
    const interpreter = new Interpreter()
    const result = interpreter.eval(pg, env)
    assert.deepStrictEqual(result.inspect(), "hellooo world")
  })

  test('eval of builtin functions', () => {
    const tests = [
      {
        input: `len("")`,
        output: "0"
      },
      {
        input: `len("four")`,
        output: "4"
      },
      {
        input: `len("hello world")`,
        output: "11"
      },
      {
        input: `len(1)`,
        output: "argument to 'len' not supported, expected: STRING, got: INTEGER"
      },
      {
        input: `len("one","two")`,
        output: "arguments mismatch, expected: 1, got: 2"
      },
      {
        input: `let a = [1, 2, 3, 4]; first(a);`,
        output: "1"
      },
      {
        input: `let a = [1, 2, 3, 4]; last(a);`,
        output: "4"
      },
      {
        input: `let a = [1, 2, 3, 4]; rest(a);`,
        output: "[2, 3, 4]"
      },
      {
        input: `let a = [1, 2, 3, 4]; rest(rest(a));`,
        output: "[3, 4]"
      },
      {
        input: `let a = [1, 2, 3, 4]; rest(rest(rest(a)));`,
        output: "[4]"
      },
      {
        input: `let a = [1, 2, 3, 4]; rest(rest(rest(rest(a))));`,
        output: "[]"
      },
      {
        input: `let a = [1, 2, 3, 4]; rest(rest(rest(rest(rest(a)))));`,
        output: "null"
      },
      {
        input: `let a = [1, 2, 3, 4]; push(a, 5);`,
        output: "[1, 2, 3, 4, 5]"
      },
    ]
    for (const input of tests) {
      const lexer = new Lexer(input.input)
      const parser = new Parser(lexer)
      const pg = parser.parse()
      const env = new Environment(null)
      const interpreter = new Interpreter()
      const result = interpreter.eval(pg, env)
      assert.deepStrictEqual(result.inspect(), input.output)

    }
  })

  test('eval of array indexing', () => {
    const tests = [
      {
        input: `[1, 2, 3][0]`,
        output: "1"
      },
      {
        input: `[1, 2, 3][1]`,
        output: "2"
      },
      {
        input: `[1, 2, 3][2]`,
        output: "3"
      },
      {
        input: `let i = 0; [1][i];`,
        output: "1"
      },
      {
        input: `let myArray = [1, 2, 3]; myArray[2];`,
        output: "3"
      },
      {
        input: `let myArray = [1, 2, 3]; myArray[0] + myArray[1] + myArray[2];`,
        output: "6"
      },
      {
        input: `let myArray = [1, 2, 3]; let i = myArray[0]; myArray[i]`,
        output: "2"
      },
      {
        input: `[1, 2, 3][3]`,
        output: "null"
      },
      {
        input: `[1, 2, 3][-1]`,
        output: "null"
      },
    ]
    for (const input of tests) {
      const lexer = new Lexer(input.input)
      const parser = new Parser(lexer)
      const pg = parser.parse()
      const env = new Environment(null)
      const interpreter = new Interpreter()
      const result = interpreter.eval(pg, env)
      assert.deepStrictEqual(result.inspect(), input.output)

    }
  })

  test('eval of hash', () => {
    const tests = [
      {
        input: `{"foo": 5}`,
        output: `{ "hash" }`
      },
      {
        input: `{"foo": 5}["foo"]`,
        output: "5"
      },
      {
        input: `{"foo": 5}["bar"]`,
        output: "null"
      },
      {
        input: `let key = "foo"; {"foo": 5}[key]`,
        output: "5"
      },
      {
        input: `{}["foo"]`,
        output: "null"
      },
      {
        input: `{5: 5}[5]`,
        output: "5"
      },
      {
        input: `{true: 5}[true]`,
        output: "5"
      },
      {
        input: `{false: 5}[false]`,
        output: "5"
      },
    ]
    for (const input of tests) {
      const lexer = new Lexer(input.input)
      const parser = new Parser(lexer)
      const pg = parser.parse()
      const env = new Environment(null)
      const interpreter = new Interpreter()
      const result = interpreter.eval(pg, env)
      assert.deepStrictEqual(result.inspect(), input.output)

    }
  })
})

