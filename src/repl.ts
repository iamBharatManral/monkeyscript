import readline from 'readline';
import Lexer from './frontend/lexer';
import { Token, TokenType } from './frontend/token';

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
    let tok: Token;
    for (tok = lexer.nextToken(); tok.type !== TokenType.EOF; tok = lexer.nextToken()) {
      console.log(tok)
    }
    console.log(tok)
  }
}
