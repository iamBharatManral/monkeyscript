import { TokenType } from "./token";

export function syntaxError(expected: TokenType, got: TokenType): string {
  return `syntax error: expected ${expected}, got ${got}`
}
