import { CommandHandler } from '../interpreter/command-registry.js'
import {
  ExecutionContext,
  StatementLog,
} from '../interpreter/execution-context.js'
import { ActionResult } from './action-result.js'

export abstract class BaseCommandHandler<T> implements CommandHandler<T> {
  abstract run(
    args: Record<string, any>,
    context: ExecutionContext,
    output?: string,
  ): Promise<ActionResult<T>>

  protected handleSuccess(message: string, value: T): ActionResult<T> {
    const log: StatementLog = {
      success: true,
      statement: this.toString(),
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      message,
    }
    const result: ActionResult<T> = {
      success: true,
      value,
      message,
      logs: [log],
    }
    if (result.success) {
      console.log(`✅ ${result.message}`)
    } else {
      console.error(`❌ ${result.message}`)
    }
    return result
  }

  protected handleError(message: string): string {
    return message
  }

  protected async cleanup(): Promise<void> {}

  toString(): string {
    return `Action: ${this.constructor.name}`
  }
}
