import { ActionResult } from '../../compiler/handlers/action-result.js'
import { BaseCommandHandler } from '../../compiler/handlers/base-command-handler.js'
import { ExecutionContext } from '../../compiler/interpreter/execution-context.js'
import { errorToString } from '../../utils/error-to-string.js'
import { BrowserManager } from '../browser/browser-manager.js'

export class OpenAction extends BaseCommandHandler<void> {
  constructor() {
    super()
  }

  async run(
    params: string[],
    context: ExecutionContext,
  ): Promise<ActionResult<void>> {
    if (params.length === 0) {
      throw this.handleError('No URL provided')
    }

    let browserManager = context.extra['browserManager'] as BrowserManager
    if (!browserManager) {
      browserManager = new BrowserManager()
      context.extra['browserManager'] = browserManager
    }

    const url = params[0]
    try {
      return await this.runOpen(browserManager, url)
    } catch (error) {
      throw this.handleError(`Error opening ${url}: ${errorToString(error)}`)
    }
  }

  async runOpen(browserManager: BrowserManager, url: string) {
    await browserManager.navigateTo(url)
    return this.handleSuccess(`Successfully opened ${url}`)
  }
}
