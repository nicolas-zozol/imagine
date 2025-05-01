import { ActionHandler, ActionResult } from './actions.js'

export abstract class BaseAction implements ActionHandler {
  abstract execute(params: string[]): Promise<void>

  protected async handleResult(result: ActionResult): Promise<void> {
    if (result.success) {
      console.log(`✅ ${result.message}`)
      if (result.data) {
        console.log('Data:', result.data)
      }
    } else {
      console.error(`❌ ${result.message}`)
    }
  }

  protected async cleanup(): Promise<void> {}

  toString(): string {
    return `Action: ${this.constructor.name}`
  }
}
