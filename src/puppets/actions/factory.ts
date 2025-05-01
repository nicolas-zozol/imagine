import { BrowserManager } from '../browser'
import { Action } from '../../execution-context/actions.js'
import { PuppetActionOptions } from './base-puppet-action.js'
import { ClickAction } from './click.js'
import { CloseAction } from './close.js'
import { GoogleSuggestionsAction } from './suggestion'
import { OpenAction } from './open'
import { BaseAction } from '../../execution-context/base.js'

const actions: Record<string, Action> = {
  googleSuggest: {
    name: 'google-suggest',
    description: 'Get Google suggestions for a query',
    params: [
      {
        name: 'query',
        type: 'string',
        description: 'The query to get suggestions for',
      },
    ],
  },
  open: {
    name: 'open',
    description: 'Open a URL in the browser',
    params: [
      {
        name: 'url',
        type: 'string',
        description: 'The URL to open',
      },
    ],
  },
  click: {
    name: 'click',
    description: 'Click on an element',
    params: [
      {
        name: 'selector',
        type: 'string',
        description: 'The CSS selector of the element to click',
      },
    ],
  },
  close: {
    name: 'close',
    description: 'Close the browser',
  },
}

export class ActionFactory {
  protected browserManager: BrowserManager
  launched: boolean = false

  constructor() {
    this.browserManager = new BrowserManager()
  }

  async launch() {
    await this.browserManager.launch()
    this.launched = true
  }

  createAction(action: string): BaseAction {
    if (!this.launched) {
      throw new Error(
        'BrowserManager not launched. Call factory.launch() before creating actions.',
      )
    }

    // Not implemented yet
    const options: PuppetActionOptions = {}
    switch (action) {
      case actions.googleSuggest.name:
        return new GoogleSuggestionsAction(this.browserManager, options)
      case actions.open.name:
        return new OpenAction(this.browserManager, options)
      case actions.click.name:
        return new ClickAction(this.browserManager, options)
      case actions.close.name:
        return new CloseAction(this.browserManager)
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }
}
