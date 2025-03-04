import repl from "./repl"
import execute from "./scripter";
import { usage } from "./utils";

async function main() {

  // start repl by default
  if (process.argv.length === 2) {
    await repl()
  }

  // execute code from file
  if (process.argv.length === 3) {
    execute(process.argv[2])
  }

  usage()
}

main()
