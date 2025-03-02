import { Keywords, Token, TokenType } from "./token";
import { Optional } from '../types';

export default class Lexer {
  constructor(private source: string, private position: number = 0, private readPosition: number = 0, private char: Optional<string> = "") {
    this.readChar();
  }

  nextToken(): Token {
    let token: Token;
    this.skipWhiteSpace()
    switch (this.char) {
      case "+":
        token = new Token(TokenType.PLUS, this.char)
        break
      case "-":
        token = new Token(TokenType.MINUS, this.char)
        break
      case "*":
        token = new Token(TokenType.ASTERISK, this.char)
        break
      case "/":
        token = new Token(TokenType.SLASH, this.char)
        break
      case "!":
        if (this.peekChar() === "=") {
          token = new Token(TokenType.NE, "!=")
          this.readChar()
        } else {
          token = new Token(TokenType.BANG, this.char)
        }
        break
      case "<":
        token = new Token(TokenType.LT, this.char)
        break
      case ">":
        token = new Token(TokenType.GT, this.char)
        break
      case ",":
        token = new Token(TokenType.COMMA, this.char)
        break
      case "=":
        if (this.peekChar() === "=") {
          token = new Token(TokenType.EQ, "==")
          this.readChar()
        } else {
          token = new Token(TokenType.ASSIGN, this.char)
        }
        break
      case ";":
        token = new Token(TokenType.SEMICOLON, this.char)
        break
      case "(":
        token = new Token(TokenType.LPAREN, this.char)
        break
      case ")":
        token = new Token(TokenType.RPAREN, this.char)
        break
      case "{":
        token = new Token(TokenType.LBRACE, this.char)
        break
      case "}":
        token = new Token(TokenType.RBRACE, this.char)
        break
      case null:
        token = new Token(TokenType.EOF, "")
        break
      default:
        if (this.isLetter(this.char)) {
          return this.readIdentifier()
        } else if (this.isDigit(this.char)) {
          return this.readNumber()
        }
        return new Token(TokenType.ILLEGAL, "")
    }
    this.readChar()
    return token
  }

  private readNumber(): Token {
    let iden = ""
    while (this.isDigit(this.char)) {
      iden += this.char;
      this.readChar()
    }
    return new Token(TokenType.INT, iden)

  }
  private isLetter(char: string) {
    return /^[a-zA-Z_]$/.test(char);
  }

  private skipWhiteSpace() {
    while (this.isWhitespace(this.char)) {
      this.readChar();
    }
  }

  private peekChar(): Optional<string> {
    if (this.readPosition >= this.source.length) return null;
    return this.source[this.readPosition];
  }


  private isDigit(char: Optional<string>) {
    if (char === null) return false;
    return /^\d$/.test(char);
  }
  private isWhitespace(char: Optional<string>) {
    if (char === null) return false;
    return /^\s$/.test(char);
  }

  private readIdentifier(): Token {
    let iden = "";
    while (this.isLetter(this.char as string)) {
      iden += this.char;
      this.readChar()
    }
    return Keywords[iden]
      ? new Token(Keywords[iden], iden)
      : new Token(TokenType.IDENT, iden)
  }
  private readChar() {
    if (this.readPosition >= this.source.length) {
      this.char = null;
      return;
    }
    this.char = this.source[this.readPosition];
    this.position = this.readPosition++;
  }
}
