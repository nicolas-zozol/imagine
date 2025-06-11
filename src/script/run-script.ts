import './hello-ai.js'
import dotenv from 'dotenv'
import fs from 'node:fs/promises'
import { BrowserManager } from '../puppets/browser/browser-manager.js'

dotenv.config()

function parseLine(line: string): { action: string; params: string[] } {
  const [actionName, ...rest] = line.trim().split(/\s+/)
  return { action: actionName, params: rest }
}

async function runScript(script: string, keepOpenFlag = false) {
  const browserManager = new BrowserManager()
  const factory = new ActionFactory()

  await factory.launch()
  const context = initContext()

  // sequential execution – for-of + await keeps order intact
  for (const rawLine of script.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue // skip blank / comment

    const { action, params } = parseLine(line)

    const handler = factory.createAction(action)
    console.log('▶', line)
    const result = await handler.execute(params)
    console.log('◀', result.value, context.state)
    context.update(result)
  }

  console.log('Script executed, with final context:', context.state)
}

async function main() {
  const [arg1, ...rest] = process.argv.slice(2)

  // Case A: user passed a filename → treat file content as the script
  if (arg1 && (arg1.endsWith('.txt') || arg1.endsWith('.md'))) {
    console.log('CASE A !!!Running script from file:', arg1)
    const script = await fs.readFile(arg1, 'utf8')
    const keepOpen = rest.includes('--keep-open')
    await runScript(script, keepOpen)
    return
  } else {
    throw new Error('Invalid argument. Please provide a valid file name.')
  }
}

main().catch(console.error)

function parseArgs(args: string[]): {
  action: string
  params: string[]
} {
  const keepOpenIndex = args.indexOf('--keep-open')
  const keepOpen = keepOpenIndex !== -1

  // Remove the --keep-open flag if present
  const filteredArgs = keepOpen
    ? args.filter((_, i) => i !== keepOpenIndex)
    : args

  if (filteredArgs.length === 0) {
    console.log('Usage: yarn puppets <action> [params...] [--keep-open]')
    console.log('\nAvailable actions:')
    console.log(
      '  search <term1> [term2] ... - Search Google for terms (closes by default)',
    )
    console.log('  open <url> - Open a website (stays open by default)')
    console.log('\nOptions:')
    console.log('  --keep-open - Override the default behavior for the action')
    process.exit(1)
  }

  const [actionName, ...params] = filteredArgs
  const action = actionName

  return {
    action,
    params,
  }
}
