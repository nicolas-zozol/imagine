import puppeteer, { Browser, Page } from 'puppeteer'

import { ActionResult } from '../../compiler/handlers/action-result.js'
import { BaseCommandHandler } from '../../compiler/handlers/base-command-handler.js'
import { ExecutionContext } from '../../compiler/interpreter/execution-context.js'
import { errorToString } from '../../utils/error-to-string.js'
import {
  BrowserManager,
  getBrowserManager,
} from '../browser/browser-manager.js'

// Map of predefined selector aliases
const predefinedSelectors: { [key: string]: string } = {
  '<accept-google>': 'button:nth-of-type(2) div[role="none"]',
  // Add more aliases here
}

function resolveSelector(selector: string): string {
  const valid =
    selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>'
  if (!valid) {
    return selector
  } else {
    return predefinedSelectors[selector] || selector
  }
}

// Function to add more predefined selectors dynamically
export function addPredefinedSelectors(newSelectors: {
  [key: string]: string
}) {
  Object.assign(predefinedSelectors, newSelectors)
}

export class ClickAction extends BaseCommandHandler<void> {
  constructor() {
    super()
  }
  async run(
    args: string[],
    context: ExecutionContext,
  ): Promise<ActionResult<void>> {
    if (args.length === 0) {
      throw new Error(
        'ClickAction requires a selector or alias (@alias) as the first parameter.',
      )
    }
    const selectorOrAlias = args[0]
    const selector = resolveSelector(selectorOrAlias)
    const browser = getBrowserManager(context)
    const page = browser.getPage()

    try {
      return await this.runClick(selector, page)
    } catch (error: any) {
      const errorMessage = `❌ Failed to click on selector "${selectorOrAlias}": ${errorToString(error)}`
      this.handleError(errorMessage)
      throw error
    }
    // No cleanup here, it should be handled by the orchestrator or runner
  }
  async runClick(
    selectorOrAlias: string,
    page: Page,
  ): Promise<ActionResult<void>> {
    const selector = resolveSelector(selectorOrAlias)
    await page.waitForSelector(selector, { timeout: 5000 })
    await page.click(selector)
    const message = `✅ Clicked on selector: ${selectorOrAlias}`
    return this.handleSuccess(message)
  }
}
