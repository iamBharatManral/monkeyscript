import Lexer from '../src/frontend/lexer'
import { Token, TokenType } from '../src/frontend/token'
import assert from 'assert'

describe('testing lexer', () => {

  test('random tokens', () => {
    const input = "=+(){},;";
    const expected: Array<Token> = [
      new Token(TokenType.ASSIGN, "="),
      new Token(TokenType.PLUS, "+"),
      new Token(TokenType.LPAREN, "("),
      new Token(TokenType.RPAREN, ")"),
      new Token(TokenType.LBRACE, "{"),
      new Token(TokenType.RBRACE, "}"),
      new Token(TokenType.COMMA, ","),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.EOF, ""),
    ];

    const lexer = new Lexer(input);
    const got = generateTokens(lexer);

    assert.deepStrictEqual(expected, got)

  })

  test('small monkey program', () => {
    const input = `let five = 5;
                   let ten = 10;
                   let add = fn(x, y) {
                   x + y;
                   };
                   let result = add(five, ten);`

    const expected: Array<Token> = [
      new Token(TokenType.LET, "let"),
      new Token(TokenType.IDENT, "five"),
      new Token(TokenType.ASSIGN, "="),
      new Token(TokenType.INT, "5"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.LET, "let"),
      new Token(TokenType.IDENT, "ten"),
      new Token(TokenType.ASSIGN, "="),
      new Token(TokenType.INT, "10"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.LET, "let"),
      new Token(TokenType.IDENT, "add"),
      new Token(TokenType.ASSIGN, "="),
      new Token(TokenType.FUNCTION, "fn"),
      new Token(TokenType.LPAREN, "("),
      new Token(TokenType.IDENT, "x"),
      new Token(TokenType.COMMA, ","),
      new Token(TokenType.IDENT, "y"),
      new Token(TokenType.RPAREN, ")"),
      new Token(TokenType.LBRACE, "{"),
      new Token(TokenType.IDENT, "x"),
      new Token(TokenType.PLUS, "+"),
      new Token(TokenType.IDENT, "y"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.RBRACE, "}"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.LET, "let"),
      new Token(TokenType.IDENT, "result"),
      new Token(TokenType.ASSIGN, "="),
      new Token(TokenType.IDENT, "add"),
      new Token(TokenType.LPAREN, "("),
      new Token(TokenType.IDENT, "five"),
      new Token(TokenType.COMMA, ","),
      new Token(TokenType.IDENT, "ten"),
      new Token(TokenType.RPAREN, ")"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.EOF, ""),
    ];

    const lexer = new Lexer(input);
    const got = generateTokens(lexer);

    assert.deepStrictEqual(expected, got)

  })
  test('another set of tokens', () => {
    const input = `!-/*5;
                    5 < 10 > 5;`

    const expected: Array<Token> = [
      new Token(TokenType.BANG, "!"),
      new Token(TokenType.MINUS, "-"),
      new Token(TokenType.SLASH, "/"),
      new Token(TokenType.ASTERISK, "*"),
      new Token(TokenType.INT, "5"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.INT, "5"),
      new Token(TokenType.LT, "<"),
      new Token(TokenType.INT, "10"),
      new Token(TokenType.GT, ">"),
      new Token(TokenType.INT, "5"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.EOF, ""),
    ];

    const lexer = new Lexer(input);
    const got = generateTokens(lexer);

    assert.deepStrictEqual(expected, got)
  })

  test('test if else return token', () => {
    const input = `if (5 < 10) {
                   return true;
                   } else {
                   return false;
                   }`

    const expected: Array<Token> = [
      new Token(TokenType.IF, "if"),
      new Token(TokenType.LPAREN, "("),
      new Token(TokenType.INT, "5"),
      new Token(TokenType.LT, "<"),
      new Token(TokenType.INT, "10"),
      new Token(TokenType.RPAREN, ")"),
      new Token(TokenType.LBRACE, "{"),
      new Token(TokenType.RETRUN, "return"),
      new Token(TokenType.TRUE, "true"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.RBRACE, "}"),
      new Token(TokenType.ELSE, "else"),
      new Token(TokenType.LBRACE, "{"),
      new Token(TokenType.RETRUN, "return"),
      new Token(TokenType.FALSE, "false"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.RBRACE, "}"),
      new Token(TokenType.EOF, ""),
    ];

    const lexer = new Lexer(input);
    const got = generateTokens(lexer);

    assert.deepStrictEqual(expected, got)
  })

  test('comparison tokens', () => {
    const input = `10 == 10;
                   10 != 9;
                   <= >= <
                   `;
    const expected: Array<Token> = [
      new Token(TokenType.INT, "10"),
      new Token(TokenType.EQ, "=="),
      new Token(TokenType.INT, "10"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.INT, "10"),
      new Token(TokenType.NE, "!="),
      new Token(TokenType.INT, "9"),
      new Token(TokenType.SEMICOLON, ";"),
      new Token(TokenType.LE, "<="),
      new Token(TokenType.GE, ">="),
      new Token(TokenType.LT, "<"),
      new Token(TokenType.EOF, ""),
    ];

    const lexer = new Lexer(input);
    const got = generateTokens(lexer);

    assert.deepStrictEqual(expected, got)

  })

})


function generateTokens(lexer: Lexer) {
  const got: Array<Token> = [];
  while (true) {
    const token = lexer.nextToken();
    if (token.type === TokenType.EOF) {
      got.push(token);
      break;
    }
    got.push(token);
  }
  return got;
}
