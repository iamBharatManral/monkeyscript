import readline from 'readline';
import Lexer from './frontend/lexer';
import Parser from './frontend/parser';

const rl = readline.createInterface(
  process.stdin,
  process.stdout
);

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

export default async function repl() {

  const MAIN_PROMPT = "> ";

  while (true) {
    const input = await askQuestion(MAIN_PROMPT)
    if (input === ":q") {
      process.exit(0);
    }
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const pg = parser.parse()
    if (parser.errors.length > 0) {
      for (const err of parser.errors) {
        console.log(err)
      }
      continue
    }
    for (const stmt of pg.statements) {
      console.log(stmt.toString())
    }
  }
}
