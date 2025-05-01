import { ActionFactory } from './actions/factory'

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

async function main() {
  console.log('##### main program NOT USED ????')
  const { action, params } = parseArgs(process.argv.slice(2))

  console.log(`Action: ${action}, Params: ${params.join(', ')}`)
  const factory = new ActionFactory()

  await factory.launch()
  const actionHandler = factory.createAction(action)

  await actionHandler.execute(params)
}

main().catch(console.error)
