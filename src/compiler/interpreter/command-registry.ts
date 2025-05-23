// Command Handler Interface
import { F } from '@masala/parser'
import { ActionResult } from '../handlers/action-result.js'
import { commandParser } from '../parser/command-parser.js'
import { ExecutionContext, StatementLog } from './execution-context.js'

export interface CommandHandler<T> {
  run(
    args: Record<string, any>,
    context: ExecutionContext,
  ): Promise<ActionResult<T>>
}

// Command Registry
export class CommandRegistry {
  private registry = new Map<string, CommandHandler<any>>()

  register(id: string, handler: CommandHandler<any>) {
    if (!getIdParser().val(id)) {
      throw new Error(
        `Invalid command ID: ${id}. Must match @package/name format.`,
      )
    }
    this.registry.set(id, handler)
  }

  resolve(id: string): CommandHandler<any> | undefined {
    if (!getIdParser().val(id)) {
      throw new Error(
        `Invalid command ID: ${id}. Must match @package/name format.`,
      )
    }
    return this.registry.get(id)
  }
}

function getIdParser() {
  return commandParser.then(F.eos())
}
