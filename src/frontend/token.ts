export class Token {
  constructor(public type: TokenType, public literal: string) { }
}

export enum TokenType {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",

  IDENT = "IDENT",
  INT = "INT",

  ASSIGN = "ASSIGN",
  PLUS = "PLUS",
  MINUS = "MINUS",
  BANG = "BANG",
  ASTERISK = "ASTERISK",
  SLASH = "SLASH",

  LT = "LT",
  GT = "GT",
  EQ = "EQ",
  NE = "NE",

  COMMA = "COMMA",
  SEMICOLON = "SEMICOLON",

  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  LBRACE = "LBRACE",
  RBRACE = "RBRACE",

  FUNCTION = "FUNCTION",
  LET = "LET",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETRUN = "RETURN",

}

export const Keywords: { [key: string]: TokenType } = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETRUN,
}
