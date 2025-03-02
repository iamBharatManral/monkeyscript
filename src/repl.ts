import readline from 'readline';
import { run } from './runner';

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
    run(input)
  }
}
