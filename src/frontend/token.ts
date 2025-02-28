export interface token {
  type: tokenType
  literal: string
}

export enum tokenType {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",

  IDENT = "IDENT",
  INT = "INT",

  ASSIGN = "ASSIGN",
  PLUS = "PLUS",

  COMMA = ",",
  SEMICOLON = ";",

  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",

  FUNCTION = "FUNCTION",
  LET = "LET"

}
