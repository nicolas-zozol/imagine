import { ActionHandler, ActionResult } from './actions.js'
import { ActionLog } from './execution-context.js'

export abstract class BaseAction<T> implements ActionHandler<T> {
  abstract execute(params: string[]): Promise<ActionResult<T>>

  protected handleSuccess(message: string, value: T): ActionResult<T> {
    const log: ActionLog = {
      action: this.toString(),
      message,
      timestamp: new Date().toISOString(),
      value,
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
