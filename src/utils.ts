import colors from 'colors'

export function header() {
  console.log(colors.red("▄▄▄▄   ▄▄▄  ▄▄▄▄  █  ▄ ▗▞▀▚▖▄   ▄  ▄▄▄ ▗▞▀▘ ▄▄▄ ▄ ▄▄▄▄     ■  "))
  console.log(colors.red("█ █ █ █   █ █   █ █▄▀  ▐▛▀▀▘█   █ ▀▄▄  ▝▚▄▖█    ▄ █   █ ▗▄▟▙▄▖"));
  console.log(colors.white("█   █ ▀▄▄▄▀ █   █ █ ▀▄ ▝▚▄▄▖ ▀▀▀█ ▄▄▄▀     █    █ █▄▄▄▀   ▐▌  "));
  console.log(colors.red("                  █  █      ▄   █               █ █       ▐▌  "));
  console.log(colors.green("                             ▀▀▀                  ▀       ▐▌  "));
}

export function usage() {
  console.log(colors.yellow(`Usage:`))
  console.log(colors.blue(`\t${colors.yellow(`node main.js: `)}will start a REPL<filename>}`))
  console.log(colors.blue(`\t${colors.yellow(`node main.js <filename.ms>: `)}will execute the file as script`))
  process.exit(1)
}

