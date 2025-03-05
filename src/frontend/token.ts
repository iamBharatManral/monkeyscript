export class Token {
  constructor(public type: TokenType, public literal: string) { }
}

export enum TokenType {
  ILLEGAL = "ILLEGAL TOKEN",
  EOF = "END OF INPUT",

  IDENT = "IDENTIFIER",
  INT = "INTEGER",

  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",
  MOD = "%",

  LT = "<",
  GT = ">",
  LE = "<=",
  GE = ">=",
  EQ = "==",
  NE = "!=",

  COMMA = ",",
  SEMICOLON = ";",

  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  LBRACK = "[",
  RBRACK = "]",
  COLON = ":",

  FUNCTION = "FN",
  LET = "LET",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETRUN = "RETURN",

  STRING = "STRING"

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
  CALL = 7,
  INDEX = 8,
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
  [TokenType.LPAREN]: Precedence.CALL,
  [TokenType.LBRACK]: Precedence.INDEX,
}
