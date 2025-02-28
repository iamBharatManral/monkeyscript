import repl from "./repl"

async function main() {
  if (process.argv.length === 2) {
    header();
    await repl()
  }
}

function header() {
  console.log("▄▄▄▄   ▄▄▄  ▄▄▄▄  █  ▄ ▗▞▀▚▖▄   ▄  ▄▄▄ ▗▞▀▘ ▄▄▄ ▄ ▄▄▄▄     ■  ");
  console.log("█ █ █ █   █ █   █ █▄▀  ▐▛▀▀▘█   █ ▀▄▄  ▝▚▄▖█    ▄ █   █ ▗▄▟▙▄▖");
  console.log("█   █ ▀▄▄▄▀ █   █ █ ▀▄ ▝▚▄▄▖ ▀▀▀█ ▄▄▄▀     █    █ █▄▄▄▀   ▐▌  ");
  console.log("                  █  █      ▄   █               █ █       ▐▌  ");
  console.log("                             ▀▀▀                  ▀       ▐▌  ");
}

main()
