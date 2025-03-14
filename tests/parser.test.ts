import { Statement, LetStatement, Identifier, IntegerLiteral, ReturnStatment, ExpressionStatement, PrefixExpression, InfixExpression, BooleanLiternal, IfExpression, BlockStatement, FunctionLiteral, CallExpression, StringLiteral, ArrayLiteral, IndexExpression, HashLiteral } from "../src/frontend/ast";
import Lexer from "../src/frontend/lexer";
import Parser from "../src/frontend/parser";
import assert from 'assert'

describe('test parser', () => {
  it('test let statement', () => {
    const input = `
                  let x = 5;
                  let y = 10;
                  let foobar = 838383;
                  `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new LetStatement(new Identifier("x"), new IntegerLiteral(5)),
      new LetStatement(new Identifier("y"), new IntegerLiteral(10)),
      new LetStatement(new Identifier("foobar"), new IntegerLiteral(838383)),
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test return statement', () => {
    const input = `
                  return 5;
                  return 10;
                  return 993322;
                  `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ReturnStatment(new IntegerLiteral(5)),
      new ReturnStatment(new IntegerLiteral(10)),
      new ReturnStatment(new IntegerLiteral(993322)),
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test identifier expression', () => {
    const input = `
    foobar;
                  `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new Identifier("foobar")),
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test integer literal expression', () => {
    const input = `
    5;
                  `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new IntegerLiteral(5)),
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test prefix expression', () => {
    const input = `
    !5;
    -15;
                  `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new PrefixExpression("!", new IntegerLiteral(5))),
      new ExpressionStatement(new PrefixExpression("-", new IntegerLiteral(15))),
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test infix expression', () => {
    const input = `
    5 + 5;
    5 - 5;
    5 * 5;
    5 / 5;
    5 > 5;
    5 < 5;
    5 == 5;
    5 != 5;
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(5), "+", new IntegerLiteral(5))),
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(5), "-", new IntegerLiteral(5))),
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(5), "*", new IntegerLiteral(5))),
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(5), "/", new IntegerLiteral(5))),
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(5), ">", new IntegerLiteral(5))),
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(5), "<", new IntegerLiteral(5))),
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(5), "==", new IntegerLiteral(5))),
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(5), "!=", new IntegerLiteral(5))),
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test boolean literal', () => {
    const input = `
    true;false;
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new BooleanLiternal(true)),
      new ExpressionStatement(new BooleanLiternal(false)),
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test operator precedence', () => {
    const input = `
    3 > 5 == false;
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new InfixExpression(new InfixExpression(new IntegerLiteral(3), ">", new IntegerLiteral(5)), "==", new BooleanLiternal(false)))
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test grouped expressions', () => {
    const input = `
    1 + (2 + 3) + 4;
    -(5 + 5);
    !(true == true);
    ((1 + (2 + 3)) + 4);
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new InfixExpression(new InfixExpression(new IntegerLiteral(1), "+", new InfixExpression(new IntegerLiteral(2), "+", new IntegerLiteral(3))), "+", new IntegerLiteral(4))),
      new ExpressionStatement(new PrefixExpression("-", new InfixExpression(new IntegerLiteral(5), "+", new IntegerLiteral(5)))),
      new ExpressionStatement(new PrefixExpression("!", new InfixExpression(new BooleanLiternal(true), "==", new BooleanLiternal(true)))),
      new ExpressionStatement(new InfixExpression(new InfixExpression(new IntegerLiteral(1), "+", new InfixExpression(new IntegerLiteral(2), "+", new IntegerLiteral(3))), "+", new IntegerLiteral(4))),
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test new mod, le, ge operator expressions', () => {
    const input = `
    11 <= 12;
    2 >= 2;
    1 % 2;
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(11), "<=", new IntegerLiteral(12))),
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(2), ">=", new IntegerLiteral(2))),
      new ExpressionStatement(new InfixExpression(new IntegerLiteral(1), "%", new IntegerLiteral(2))),
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test if expression', () => {
    const input = `
    if (x < y) { x }
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new IfExpression(new InfixExpression(new Identifier("x"), "<", new Identifier("y")), new BlockStatement([new ExpressionStatement(new Identifier("x"))]), null))
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test if else expression', () => {
    const input = `
            if (x > y) {
              x
            } else {
               y
            }
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new IfExpression(new InfixExpression(new Identifier("x"), ">", new Identifier("y")), new BlockStatement([new ExpressionStatement(new Identifier("x"))]), new BlockStatement([new ExpressionStatement(new Identifier("y"))])))
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test function literal', () => {
    const input = `
    fn(x, y) { x + y; }
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new FunctionLiteral([new Identifier("x"), new Identifier("y")], new BlockStatement([new ExpressionStatement(new InfixExpression(new Identifier("x"), "+", new Identifier("y")))])))
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test function call', () => {
    const input = `
    add(1, 2 * 3, 4 + 5);
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new CallExpression(new Identifier("add"), [new IntegerLiteral(1), new InfixExpression(new IntegerLiteral(2), "*", new IntegerLiteral(3)), new InfixExpression(new IntegerLiteral(4), "+", new IntegerLiteral(5))]))
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test string literal', () => {
    const input = `
      "bharat";
      let name = "bharat";
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new StringLiteral("bharat")),
      new LetStatement(new Identifier("name"), new StringLiteral("bharat"))
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test arrays', () => {
    const input = `
    [1, 2 * 2, 3 + 3];
      myArray[1 + 1];
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();
    const expected: Array<Statement> = [
      new ExpressionStatement(new ArrayLiteral([new IntegerLiteral(1), new InfixExpression(new IntegerLiteral(2), "*", new IntegerLiteral(2)), new InfixExpression(new IntegerLiteral(3), "+", new IntegerLiteral(3))])),
      new ExpressionStatement(new IndexExpression(new Identifier("myArray"), new InfixExpression(new IntegerLiteral(1), "+", new IntegerLiteral(1))))
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })

  it('test hash', () => {
    const input = `
    {"one": 0 + 1, "two": 10 - 8, "three": 15 / 5}
    {}
    `;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse();

    const pairs = new Map();
    pairs.set(new StringLiteral("one"), new InfixExpression(new IntegerLiteral(0), "+", new IntegerLiteral(1)));
    pairs.set(new StringLiteral("two"), new InfixExpression(new IntegerLiteral(10), "-", new IntegerLiteral(8)));
    pairs.set(new StringLiteral("three"), new InfixExpression(new IntegerLiteral(15), "/", new IntegerLiteral(5)));

    const expected: Array<Statement> = [
      new ExpressionStatement(new HashLiteral(pairs)),
      new ExpressionStatement(new HashLiteral(new Map()))
    ];
    assert.deepStrictEqual(pg.statements, expected)
  })
})

