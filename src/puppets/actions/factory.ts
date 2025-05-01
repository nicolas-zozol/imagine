import { BrowserManager } from '../browser'
import { Action, ActionOptions, ActionConfig } from '../types/actions'
import { ClickAction } from './click.js'
import { GoogleSuggestionsAction } from './suggestion'
import { OpenAction } from './open'
import { BaseAction } from './base'

const ACTION_CONFIGS: Record<Action, ActionConfig> = {
  'google-suggest': {
    defaultKeepOpen: false,
    description: 'Search Google and get suggestions',
  },
  open: {
    defaultKeepOpen: true,
    description: 'Open a website in the browser',
  },
  click: {
    defaultKeepOpen: false,
    description: 'Click on a specific element',
  },
}

export class ActionFactory {
  private browserManager: BrowserManager

  constructor(browserManager: BrowserManager) {
    this.browserManager = browserManager
  }

  createAction(action: Action, options: ActionOptions): BaseAction {
    const config = ACTION_CONFIGS[action]
    switch (action) {
      case 'google-suggest':
        return new GoogleSuggestionsAction(this.browserManager, options, config)
      case 'open':
        return new OpenAction(this.browserManager, options)
      case 'click':
        return new ClickAction(this.browserManager, options)
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }

  getActionConfig(action: Action): ActionConfig {
    return ACTION_CONFIGS[action]
  }
}
