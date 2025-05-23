import { OpenAction } from '../../puppets/actions/open.js'
import { CommandRegistry } from '../interpreter/command-registry.js'

let commandHandlerRegistry: CommandRegistry | undefined = undefined

export function getCommandHandlerRegistry() {
  if (!commandHandlerRegistry) {
    commandHandlerRegistry = new CommandRegistry()
  }
  return commandHandlerRegistry
}

export function registerAllCommandHandlers() {
  const registry = getCommandHandlerRegistry()

  const open = new OpenAction()
  registry.register('@puppet/open', open)
}
