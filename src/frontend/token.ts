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
  MOD = "MOD",

  LT = "LT",
  GT = "GT",
  LE = "LE",
  GE = "GE",
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


export enum Precedence {
  LOWEST = 1,
  EQ = 2,
  LTGT = 3,
  SUM = 4,
  PRODUCT = 5,
  PREFIX = 6,
  CALL = 7
}

export const PrecedenceTable: Partial<Record<TokenType, Precedence>> = {
  [TokenType.EQ]: Precedence.EQ,
  [TokenType.NE]: Precedence.EQ,
  [TokenType.LT]: Precedence.LTGT,
  [TokenType.GT]: Precedence.LTGT,
  [TokenType.LE]: Precedence.LTGT,
  [TokenType.GE]: Precedence.LTGT,
  [TokenType.PLUS]: Precedence.SUM,
  [TokenType.MINUS]: Precedence.SUM,
  [TokenType.MOD]: Precedence.SUM,
  [TokenType.ASTERISK]: Precedence.PRODUCT,
  [TokenType.SLASH]: Precedence.PRODUCT,
}
