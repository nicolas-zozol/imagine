import { ActionResult } from '../../execution-context/actions.js'
import { errorToString } from '../../utils/error-to-string.js'
import { BrowserManager } from '../browser/index.js'
import { BasePuppetAction, PuppetActionOptions } from './base-puppet-action.js'

export class OpenAction extends BasePuppetAction<void> {
  constructor(browserManager: BrowserManager, options: PuppetActionOptions) {
    super(browserManager, options)
  }

  async execute(params: string[]): Promise<ActionResult<void>> {
    if (params.length === 0) {
      throw this.handleError('No URL provided')
    }

    const url = params[0]
    try {
      await this.browserManager.navigateTo(url)
      return this.handleSuccess(`Successfully opened ${url}`)
    } catch (error) {
      throw this.handleError(`Error opening ${url}: ${errorToString(error)}`)
    }
  }
}
