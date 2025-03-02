import repl from "./repl"
import colors from 'colors'

async function main() {
  if (process.argv.length === 2) {
    header();
    await repl()
  }
}

function header() {
  console.log(colors.red("▄▄▄▄   ▄▄▄  ▄▄▄▄  █  ▄ ▗▞▀▚▖▄   ▄  ▄▄▄ ▗▞▀▘ ▄▄▄ ▄ ▄▄▄▄     ■  "))
  console.log(colors.red("█ █ █ █   █ █   █ █▄▀  ▐▛▀▀▘█   █ ▀▄▄  ▝▚▄▖█    ▄ █   █ ▗▄▟▙▄▖"));
  console.log(colors.white("█   █ ▀▄▄▄▀ █   █ █ ▀▄ ▝▚▄▄▖ ▀▀▀█ ▄▄▄▀     █    █ █▄▄▄▀   ▐▌  "));
  console.log(colors.red("                  █  █      ▄   █               █ █       ▐▌  "));
  console.log(colors.green("                             ▀▀▀                  ▀       ▐▌  "));
}

main()
