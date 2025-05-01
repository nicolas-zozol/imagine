import { ActionResult } from '../../execution-context/actions.js'
import { errorToString } from '../../utils/error-to-string.js'
import { BasePuppetAction, PuppetActionOptions } from './base-puppet-action.js'

// Map of predefined selector aliases
const predefinedSelectors: { [key: string]: string } = {
  'accept-google': 'button:nth-of-type(2) div[role="none"]',
  // Add more aliases here
}

// Function to add more predefined selectors dynamically
export function addPredefinedSelectors(newSelectors: {
  [key: string]: string
}) {
  Object.assign(predefinedSelectors, newSelectors)
}

export class ClickAction extends BasePuppetAction<void> {
  constructor(browserManager: any, options: PuppetActionOptions) {
    super(browserManager, options)
  }
  async execute(params: string[]): Promise<ActionResult<void>> {
    if (params.length === 0) {
      throw new Error(
        'ClickAction requires a selector or alias (@alias) as the first parameter.',
      )
    }
    const selectorOrAlias = params[0]
    let selector: string
    let aliasUsed: string | null = null

    if (selectorOrAlias.startsWith('@')) {
      aliasUsed = selectorOrAlias.substring(1)
      selector = predefinedSelectors[aliasUsed]
      if (!selector) {
        throw new Error(`Unknown selector alias used: "@${aliasUsed}"`)
      }
      console.log(`ℹ️ Using selector "${selector}" for alias "@${aliasUsed}"`)
    } else {
      selector = selectorOrAlias
    }

    try {
      await this.page.waitForSelector(selector, { timeout: 5000 })
      await this.page.click(selector)
      const logSelector = aliasUsed ? `@${aliasUsed} (${selector})` : selector
      const message = `✅ Clicked on selector: ${logSelector}`
      return this.handleSuccess(message)
    } catch (error: any) {
      const logSelector = aliasUsed ? `@${aliasUsed} (${selector})` : selector
      const errorMessage = `❌ Failed to click on selector "${logSelector}": ${errorToString(error)}`
      this.handleError(errorMessage)
      throw error
    }
    // No cleanup here, it should be handled by the orchestrator or runner
  }
}
