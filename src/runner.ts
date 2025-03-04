import Environment from "./backend/environment";
import Interpreter from "./backend/interpreter";
import Lexer from "./frontend/lexer";
import Parser from "./frontend/parser";

export function run(env: Environment, input: string) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const pg = parser.parse()
  if (parser.errors.length > 0) {
    for (const err of parser.errors) {
      console.log(err)
    }
    return;
  }
  const interpreter = new Interpreter()
  const output = interpreter.eval(pg, env)
  if (output.inspect() === "null") {
    return
  }
  console.log(output.inspect())
}
