import { BrowserManager } from '../browser/index.js'
import { BasePuppetAction } from './base-puppet-action.js'

export class CloseAction extends BasePuppetAction {
  constructor(browserManager: BrowserManager) {
    super(browserManager)
  }

  async execute(params: string[]): Promise<void> {
    try {
      await this.browserManager.close()
      await this.handleResult({
        success: true,
        message: 'Browser closed successfully',
      })
    } catch (error) {
      await this.handleResult({
        success: false,
        message: `Error closing browser: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    }
  }
}
