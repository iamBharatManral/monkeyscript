import { MObject, ErrorO, ObjectType } from "../backend/object";
import { Optional } from "../types";
import { Token, TokenType } from "./token";

export function syntaxError(expected: TokenType | string, got: Token): string {
  const valueTokenTypes = [TokenType.ILLEGAL, TokenType.INT];
  const value = valueTokenTypes.includes(got.type) ? ` (${got.literal})` : "";
  return `syntax error: expected '${expected.toLowerCase()}', got '${got.type.toLowerCase()}${value}'`
}

export function expectAssignOpError(got: Token): string {
  return syntaxError(TokenType.ASSIGN, got)
}

export function expectLeftParenError(got: Token): string {
  return syntaxError(TokenType.LPAREN, got)
}

export function expectRightParenError(got: Token): string {
  return syntaxError(TokenType.RPAREN, got)
}

export function expectLeftBraceError(got: Token): string {
  return syntaxError(TokenType.LBRACE, got)
}

export function expectRightBraceError(got: Token): string {
  return syntaxError(TokenType.RBRACE, got)
}

export function expectRightBracketError(got: Token): string {
  return syntaxError(TokenType.RBRACK, got)
}

export function expectExpressionError(got: Token): string {
  return syntaxError("expression", got)
}

export function expectIdentifierError(got: Token): string {
  return syntaxError(TokenType.IDENT, got)
}

export function unknowOpError(op: string, left: Optional<MObject> = null, right: Optional<MObject> = null): MObject {
  if (!left && !right) {
    return new ErrorO(`unknown unary operator: ${op}`)
  }
  return new ErrorO(`unknown binary operator: ${left?.type()} ${op} ${right?.type()}`)
}

export function identifierNotFoundError(id: MObject | string): MObject {
  return new ErrorO(`identifier not found: '${id}'`)
}

export function argumentMismatchError(expected: number, got: number): MObject {
  return new ErrorO(`arguments mismatch, expected: ${expected}, got: ${got}`)
}

export function argumentNotSupportedError(fnName: string, expected: ObjectType, got: ObjectType): MObject {
  return new ErrorO(`argument to '${fnName}' not supported, expected: ${expected}, got: ${got}`)
}

export function indexOpNotSupportedError(left: MObject) {
  return new ErrorO(`index operator not supported: ${left.type()}`);
}
