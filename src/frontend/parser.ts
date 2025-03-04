import { Optional } from "../types";
import { BlockStatement, BooleanLiternal, CallExpression, Expression, ExpressionStatement, FunctionLiteral, Identifier, IfExpression, InfixExpression, infixFunc, IntegerLiteral, LetStatement, PrefixExpression, prefixFunc, Program, ReturnStatment, Statement, StringLiteral } from "./ast";
import { expectAssignOpError, expectExpressionError, expectIdentifierError, expectLeftBraceError, expectLeftParenError, expectRightParenError } from "./error";
import Lexer from "./lexer";
import { Precedence, PrecedenceTable, Token, TokenType } from "./token";

export default class Parser {
  curToken: Token;
  peekToken: Token;
  errors: Array<string> = [];
  prefixFuncs: Map<TokenType, prefixFunc> = new Map();
  infixFuncs: Map<TokenType, infixFunc> = new Map();

  constructor(private lexer: Lexer) {
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();
    this.registerFuncs();
  }

  private registerFuncs() {
    this.registerPrefixFunc(TokenType.IDENT, this.parseIdentifier)
    this.registerPrefixFunc(TokenType.INT, this.parseIntegerLiteral)
    this.registerPrefixFunc(TokenType.TRUE, this.parseBooleanLiteral)
    this.registerPrefixFunc(TokenType.FALSE, this.parseBooleanLiteral)
    this.registerPrefixFunc(TokenType.LPAREN, this.parseGroupedExpression)
    this.registerPrefixFunc(TokenType.MINUS, this.parsePrefixExpression)
    this.registerPrefixFunc(TokenType.BANG, this.parsePrefixExpression)
    this.registerPrefixFunc(TokenType.STRING, this.parseStringLiteral)
    this.registerPrefixFunc(TokenType.IF, this.parseIfExpression)
    this.registerPrefixFunc(TokenType.FUNCTION, this.parseFunctionLiteral)
    this.registerInfixFunc(TokenType.LPAREN, this.parseCallExpression)
    this.registerInfixFunc(TokenType.PLUS, this.parseInfixExpression)
    this.registerInfixFunc(TokenType.MINUS, this.parseInfixExpression)
    this.registerInfixFunc(TokenType.ASTERISK, this.parseInfixExpression)
    this.registerInfixFunc(TokenType.SLASH, this.parseInfixExpression)
    this.registerInfixFunc(TokenType.MOD, this.parseInfixExpression)
    this.registerInfixFunc(TokenType.EQ, this.parseInfixExpression)
    this.registerInfixFunc(TokenType.NE, this.parseInfixExpression)
    this.registerInfixFunc(TokenType.LT, this.parseInfixExpression)
    this.registerInfixFunc(TokenType.GT, this.parseInfixExpression)
    this.registerInfixFunc(TokenType.LE, this.parseInfixExpression)
    this.registerInfixFunc(TokenType.GE, this.parseInfixExpression)
  }

  parse(): Program {
    const stmts: Array<Statement> = [];
    while (this.curToken.type !== TokenType.EOF) {
      const stmt = this.parseStatment();
      stmt && stmts.push(stmt)
      this.nextToken()
    }
    return new Program(stmts)
  }

  private parseStatment(): Optional<Statement> {
    switch (this.curToken.type) {
      case TokenType.LET:
        return this.parseLetStatement()
      case TokenType.RETRUN:
        return this.parseReturnStatement()
      default:
        return this.parseExpressionStatement()
    }
  }

  private parseLetStatement(): Optional<Statement> {
    if (!this.expectPeek(TokenType.IDENT)) {
      this.errors.push(expectIdentifierError(this.peekToken))
      return null
    }

    const id = new Identifier(this.curToken.literal)

    if (!this.expectPeek(TokenType.ASSIGN)) {
      this.errors.push(expectAssignOpError(this.peekToken))
      return null;
    }

    // consume assignment operator
    this.nextToken()

    const expr = this.parseExpression(Precedence.LOWEST)

    if (!expr) {
      this.errors.push(expectExpressionError(this.curToken))
      return null
    }

    // end the parsing of stmt at semicolon if present
    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken()
    }

    return new LetStatement(id, expr)

  }

  private parseReturnStatement(): Optional<Statement> {
    // consume 'return' keyword
    this.nextToken()

    const expr = this.parseExpression(Precedence.LOWEST)

    if (!expr) {
      this.errors.push(expectExpressionError(this.curToken))
      return null
    }

    // end the parsing of stmt at semicolon if present
    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken()
    }

    return new ReturnStatment(expr);
  }

  private parseExpressionStatement(): Optional<Expression> {
    const token = this.curToken;
    const expr = this.parseExpression(Precedence.LOWEST);

    if (!expr) {
      this.errors.push(expectExpressionError(token))
      return null
    }

    // end the parsing of stmt at semicolon if present
    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken()
    }

    return new ExpressionStatement(expr);
  }

  private parseExpression(precedence: number): Optional<Expression> {
    const prefix = this.prefixFuncs.get(this.curToken.type)

    if (!prefix) {
      this.errors.push(expectExpressionError(this.curToken))
      return null
    }

    let left = prefix.call(this)

    while (!this.peekTokenIs(TokenType.SEMICOLON) && precedence < this.peekPrecedence()) {
      const infix = this.infixFuncs.get(this.peekToken.type)
      if (!infix) {
        return left
      }
      this.nextToken();
      left = infix.call(this, left)
    }

    return left
  }


  private parseInfixExpression(left: Optional<Expression>): Optional<Expression> {
    const token = this.curToken;
    const infixPrec = this.curPrecedence();
    this.nextToken()
    const right = this.parseExpression(infixPrec)
    if (!left || !right) {
      this.errors.push(expectExpressionError(this.curToken))
      return null
    }
    return new InfixExpression(left, token.literal, right)
  }

  private parseCallExpression(fn: Optional<Expression>): Optional<Expression> {
    const args = this.parseCallArguments()
    if (!fn) {
      this.errors.push(expectExpressionError(new Token(TokenType.ILLEGAL, "")))
      return null
    }
    return new CallExpression(fn, args)
  }

  private parseCallArguments(): Array<Expression> {
    const args: Array<Expression> = []
    if (this.peekTokenIs(TokenType.RPAREN)) {
      this.nextToken()
      return args
    }
    this.nextToken()
    const exp = this.parseExpression(Precedence.LOWEST)
    if (!exp) {
      this.errors.push(expectExpressionError(this.curToken))
      return args
    }
    args.push(exp)

    while (this.peekTokenIs(TokenType.COMMA)) {
      this.nextToken()
      this.nextToken()
      const exp = this.parseExpression(Precedence.LOWEST)
      if (!exp) break
      args.push(exp)
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      this.errors.push(expectRightParenError(this.peekToken))
      return args
    }

    return args
  }

  private parseFunctionLiteral(): Optional<Expression> {
    if (!this.expectPeek(TokenType.LPAREN)) {
      this.errors.push(expectLeftParenError(this.peekToken))
      return null
    }
    const params = this.parseFunctionParameters()

    if (!this.expectPeek(TokenType.LBRACE)) {
      this.errors.push(expectLeftBraceError(this.peekToken))
      return null
    }
    const body = this.parseBlockStatement()
    return new FunctionLiteral(params, body)

  }

  private parseFunctionParameters(): Array<Identifier> {
    const params: Array<Identifier> = []

    if (this.peekTokenIs(TokenType.RPAREN)) {
      this.nextToken()
      return params
    }

    // consume left parenthesis
    this.nextToken()

    params.push(new Identifier(this.curToken.literal))

    while (this.peekTokenIs(TokenType.COMMA)) {
      this.nextToken()
      this.nextToken()
      params.push(new Identifier(this.curToken.literal))
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      this.errors.push(expectRightParenError(this.peekToken))
      return params
    }

    return params
  }

  private parseIfExpression(): Optional<Statement> {
    if (!this.expectPeek(TokenType.LPAREN)) {
      this.errors.push(expectLeftParenError(this.peekToken))
      return null
    }
    // consume left parenthesis
    this.nextToken()

    const condition = this.parseExpression(Precedence.LOWEST);

    if (!condition) {
      this.errors.push(expectExpressionError(this.curToken))
      return null
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      this.errors.push(expectRightParenError(this.peekToken))
      return null
    }

    if (!this.expectPeek(TokenType.LBRACE)) {
      this.errors.push(expectLeftBraceError(this.peekToken))
      return null
    }

    const consequence = this.parseBlockStatement()

    let alternative: Optional<BlockStatement> = null;

    if (this.peekTokenIs(TokenType.ELSE)) {
      // consume right brace
      this.nextToken()

      if (!this.expectPeek(TokenType.LBRACE)) {
        this.errors.push(expectLeftBraceError(this.peekToken))
        return null
      }

      alternative = this.parseBlockStatement()
    }

    return new IfExpression(condition, consequence, alternative)

  }

  private parseBlockStatement(): BlockStatement {
    const stmts: Array<Statement> = [];
    this.nextToken()
    while (!this.curTokenIs(TokenType.RBRACE) && !this.curTokenIs(TokenType.EOF)) {
      const stmt = this.parseStatment()
      if (stmt) {
        stmts.push(stmt)
      }
      this.nextToken()
    }
    return new BlockStatement(stmts)
  }

  private parsePrefixExpression(): Optional<Expression> {
    const token = this.curToken;

    // consume prefix op
    this.nextToken();

    const expr = this.parseExpression(Precedence.PREFIX)

    if (!expr) {
      this.errors.push(expectExpressionError(this.curToken))
      return null
    }
    return new PrefixExpression(token.literal, expr)
  }

  private parseBooleanLiteral(): Optional<Expression> {
    return new BooleanLiternal(this.curToken.literal === "true")
  }

  private parseIntegerLiteral(): Expression {
    return new IntegerLiteral(parseInt(this.curToken.literal, 10))
  }

  private parseStringLiteral(): Expression {
    return new StringLiteral(this.curToken.literal)
  }

  private parseIdentifier(): Expression {
    return new Identifier(this.curToken.literal)
  }

  private parseGroupedExpression(): Optional<Expression> {
    // consume left parenthesis
    this.nextToken()

    const exp = this.parseExpression(Precedence.LOWEST)

    if (!this.expectPeek(TokenType.RPAREN)) {
      this.errors.push(expectRightParenError(this.peekToken))
      return null
    }

    return exp;
  }

  private peekPrecedence(): number {
    return PrecedenceTable[this.peekToken.type] ?? Precedence.LOWEST;
  }

  private curPrecedence(): number {
    return PrecedenceTable[this.curToken.type] ?? Precedence.LOWEST;
  }

  private curTokenIs(tokenType: TokenType): boolean {
    return this.curToken.type === tokenType;
  }

  private peekTokenIs(tokenType: TokenType): boolean {
    return this.peekToken.type === tokenType;
  }

  private expectPeek(tokenType: TokenType): boolean {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
      return true;
    }
    return false;
  }

  private nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken()
  }

  private registerInfixFunc(tokenType: TokenType, fn: infixFunc) {
    this.infixFuncs.set(tokenType, fn)
  }

  private registerPrefixFunc(tokenType: TokenType, fn: prefixFunc) {
    this.prefixFuncs.set(tokenType, fn)
  }

}
