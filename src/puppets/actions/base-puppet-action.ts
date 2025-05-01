import { Page } from 'puppeteer'
import { BaseAction } from '../../execution-context/base.js'
import { BrowserManager } from '../browser/index.js'

export abstract class BasePuppetAction extends BaseAction {
  protected page: Page
  protected browserManager: BrowserManager

  constructor(
    browserManager: BrowserManager,
    public options: PuppetActionOptions = {},
  ) {
    super()
    this.browserManager = browserManager
    this.page = browserManager.getPage()
  }

  protected async cleanup(): Promise<void> {
    const shouldKeepOpen = this.options.keepOpen ?? true
    if (!shouldKeepOpen) {
      await this.browserManager.close()
    }
  }
}

export interface PuppetActionOptions {
  keepOpen?: boolean
  [key: string]: any
}
