import Lexer from "./frontend/lexer";
import Parser from "./frontend/parser";

export function run(input: string) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const pg = parser.parse()
  if (parser.errors.length > 0) {
    for (const err of parser.errors) {
      console.log(err)
    }
    return;
  }
  for (const stmt of pg.statements) {
    console.log(stmt.toString())
  }
}
