import { Page } from 'puppeteer'
import { config } from '../config'
import { sleep } from '../utils/delay'
import { BaseAction } from './base'
import { ActionOptions, ActionConfig } from '../types/actions'
import { BrowserManager } from '../browser/index.js'

const searchSelectors = {
  searchInput: 'textarea[name="q"]',
  suggestionsContainer: 'ul[role="listbox"]',
  items: 'form[action="/search"] li div[role="option"]',
}

export interface SuggestionResult {
  query: string
  suggestions: string[]
  timestamp: Date
}

export class GoogleSuggestionsAction extends BaseAction {
  private searchHandler: SearchHandler

  constructor(
    browserManager: BrowserManager,
    options: ActionOptions,
    config: ActionConfig,
  ) {
    super(browserManager, options, config)
    this.searchHandler = new SearchHandler(this.page)
  }

  async execute(params: string[], options: ActionOptions): Promise<void> {
    if (params.length === 0) {
      await this.handleResult({
        success: false,
        message: 'No search terms provided',
      })
      return
    }

    try {
      // Process each search term
      const query: string = params.join(' ')

      console.log(`\n🔍 Processing query: "${query}"`)

      const result = await this.searchHandler.captureSuggestions(query)
      await this.handleResult({
        success: true,
        message: `Found ${result.suggestions.length} suggestions for "${query}"`,
        data: result.suggestions,
      })

      await sleep(config.delays.betweenQueries)
    } catch (error) {
      await this.handleResult({
        success: false,
        message: `Error performing search: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      await this.cleanup()
    }
  }
}

export class SearchHandler {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async captureSuggestions(query: string): Promise<SuggestionResult> {
    try {
      // Wait for and clear the search input
      const searchInput = await this.page.waitForSelector(
        searchSelectors.searchInput,
      )
      if (!searchInput) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('Search input not found')
      }

      // Clear any existing text
      await this.page.evaluate((selector) => {
        const input = document.querySelector(selector) as HTMLTextAreaElement
        if (input) input.value = ''
      }, searchSelectors.searchInput)

      // Type the query
      await searchInput.type(query)
      await sleep(config.delays.afterTyping)

      // Wait for suggestions to appear
      await this.page.waitForSelector(searchSelectors.suggestionsContainer, {
        timeout: 5000,
      })

      // Extract suggestions
      const suggestions = await this.page.evaluate((selector) => {
        const elements = document.querySelectorAll(selector)
        return Array.from(elements)
          .map((el) => el.getAttribute('aria-label') || '')
          .filter(Boolean)
      }, searchSelectors.items)

      return {
        query,
        suggestions,
        timestamp: new Date(),
      }
    } catch (error) {
      console.error('Error performing search:', error)
      return {
        query,
        suggestions: [],
        timestamp: new Date(),
      }
    }
  }
}
