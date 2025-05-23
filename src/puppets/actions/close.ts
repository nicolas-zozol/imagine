import { ActionResult } from '../../compiler/handlers/action-result.js'
import { BaseCommandHandler } from '../../compiler/handlers/base-command-handler.js'
import { ExecutionContext } from '../../compiler/interpreter/execution-context.js'
import { errorToString } from '../../utils/error-to-string.js'
import {
  BrowserManager,
  getBrowserManager,
} from '../browser/browser-manager.js'

export class CloseAction extends BaseCommandHandler<void> {
  async run(
    args: string[],
    context: ExecutionContext,
  ): Promise<ActionResult<void>> {
    const browserManager = getBrowserManager(context)
    return this.execute(browserManager)
  }

  async execute(browserManager: BrowserManager): Promise<ActionResult<void>> {
    try {
      await browserManager.close()
      return this.handleSuccess('Browser closed successfully')
    } catch (error) {
      throw this.handleError(`Error closing browser: ${errorToString(error)}`)
    }
  }
}
