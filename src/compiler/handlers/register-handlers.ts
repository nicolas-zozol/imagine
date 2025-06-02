import { LogHandler } from '../../homemade/utils/log.handler.js'
import { FetchHandler } from '../../mcp/client/fetch/fetch.handler.js'
import { FileSystemWriterHandler } from '../../mcp/client/filesystem/filesystem.handler.js'
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

  const reader = new FetchHandler()
  registry.register('@web/fetch', reader)

  const fileWriter = new FileSystemWriterHandler()
  registry.register('@file/write', fileWriter)

  const logger = new LogHandler()
  registry.register('@utils/log', logger)
}
