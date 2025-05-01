import { ActionResult } from '../../execution-context/actions.js'
import { errorToString } from '../../utils/error-to-string.js'
import { BrowserManager } from '../browser/index.js'
import { BasePuppetAction } from './base-puppet-action.js'

export class CloseAction extends BasePuppetAction<void> {
  constructor(browserManager: BrowserManager) {
    super(browserManager)
  }

  async execute(): Promise<ActionResult<void>> {
    try {
      await this.browserManager.close()
      return this.handleSuccess('Browser closed successfully')
    } catch (error) {
      throw this.handleError(`Error closing browser: ${errorToString(error)}`)
    }
  }
}
