import readline from 'readline';
import { run } from './runner';
import Environment from './backend/environment';

const rl = readline.createInterface(
  process.stdin,
  process.stdout
);

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

export default async function repl() {

  const MAIN_PROMPT = "> ";
  const environment = new Environment(null)
  while (true) {
    const input = await askQuestion(MAIN_PROMPT)
    if (input === ":q") {
      process.exit(0);
    }
    run(environment, input)
  }
}
