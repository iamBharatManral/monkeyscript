import { readFileSync } from 'fs'
import path from 'path'
import { run } from "./runner";
import Environment from "./backend/environment";
import { usage } from './utils';
import colors from 'colors'

export default function execute(filename: string) {
  const extension = path.extname(filename)
  if (extension !== ".ms") {
    console.log(colors.red(`Oops! '${filename}' is not monkeyscript 🙊!\n`))
    usage()
  }
  let input;
  try {
    input = readFileSync(process.argv[2], 'utf-8')
    const env = new Environment(null)
    run(env, input)
    process.exit(0)
  } catch (err) {
    console.log(colors.red(`OHO! '${filename}' does not exist`))
    process.exit(1)
  }
}
