import { Optional } from "../types";
import { BooleanLiternal, Expression, ExpressionStatement, Identifier, InfixExpression, infixFunc, IntegerLiteral, LetStatement, PrefixExpression, prefixFunc, Program, ReturnStatment, Statement } from "./ast";
import { syntaxError } from "./error";
import Lexer from "./lexer";
import { Precedence, PrecedenceTable, Token, TokenType } from "./token";

export default class Parser {
  curToken: Token;
  peekToken: Token;
  errors: Array<string> = [];
  prefixFuncs: Map<TokenType, prefixFunc> = new Map()
  infixFuncs: Map<TokenType, infixFunc> = new Map()

  constructor(private lexer: Lexer) {
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();
    this.registerFuncs()
  }

  private registerFuncs() {
    this.registerPrefixFunc(TokenType.IDENT, this.parseIdentifier)
    this.registerPrefixFunc(TokenType.INT, this.parseIntegerLiteral)
    this.registerPrefixFunc(TokenType.TRUE, this.parseBooleanLiteral)
    this.registerPrefixFunc(TokenType.FALSE, this.parseBooleanLiteral)
    this.registerPrefixFunc(TokenType.LPAREN, this.parseGroupedExpression)
    this.registerPrefixFunc(TokenType.MINUS, this.parsePrefixExpression)
    this.registerPrefixFunc(TokenType.BANG, this.parsePrefixExpression)
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

  private registerInfixFunc(tokenType: TokenType, fn: infixFunc) {
    this.infixFuncs.set(tokenType, fn)
  }

  private registerPrefixFunc(tokenType: TokenType, fn: prefixFunc) {
    this.prefixFuncs.set(tokenType, fn)
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

  private parseInfixExpression(left: Optional<Expression>): Optional<Expression> {
    const token = this.curToken;
    const infixPrec = this.curPrecedence();
    this.nextToken()
    const right = this.parseExpression(infixPrec)
    if (!left || !right) {
      return null
    }
    return new InfixExpression(left, token.literal, right)
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

  private parsePrefixExpression(): Optional<Expression> {
    const token = this.curToken;
    this.nextToken();
    const expr = this.parseExpression(Precedence.PREFIX)
    if (!expr) {
      return null
    }
    return new PrefixExpression(token.literal, expr)
  }

  private parseBooleanLiteral(): Optional<Expression> {
    return new BooleanLiternal(this.curToken.literal === "true")
  }

  private parseGroupedExpression(): Optional<Expression> {
    this.nextToken()
    const exp = this.parseExpression(Precedence.LOWEST)
    if (!this.expectPeek(TokenType.RPAREN)) {
      return null
    }
    return exp;
  }

  private parseExpressionStatement(): Optional<Expression> {
    const expr = this.parseExpression(Precedence.LOWEST);
    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken()
    }
    return new ExpressionStatement(expr);
  }
  private parseReturnStatement(): Optional<Statement> {
    this.nextToken()
    const stmt = new ReturnStatment(this.parseExpression(Precedence.LOWEST));
    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken()
    }
    return stmt;
  }

  private parseLetStatement(): Optional<Statement> {
    if (!this.expectPeek(TokenType.IDENT)) {
      this.errors.push(syntaxError(TokenType.IDENT, this.peekToken.type))
      return null
    }
    const iden = new Identifier(this.curToken.literal)
    if (!this.expectPeek(TokenType.ASSIGN)) {
      this.errors.push(syntaxError(TokenType.ASSIGN, this.peekToken.type))
      return null;
    }

    this.nextToken()

    const expr = this.parseExpression(Precedence.LOWEST)

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken()
    }
    return new LetStatement(iden, expr)

  }
  private peekPrecedence(): number {
    return PrecedenceTable[this.peekToken.type] ?? Precedence.LOWEST;
  }

  private curPrecedence(): number {
    return PrecedenceTable[this.curToken.type] ?? Precedence.LOWEST;
  }

  private parseExpression(precedence: number): Optional<Expression> {
    const prefix = this.prefixFuncs.get(this.curToken.type)
    if (!prefix) {
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

  private parseIntegerLiteral(): Expression {
    return new IntegerLiteral(parseInt(this.curToken.literal, 10))
  }

  private parseIdentifier(): Expression {
    return new Identifier(this.curToken.literal)
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
}
