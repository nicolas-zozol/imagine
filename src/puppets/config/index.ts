import { Config, BrowserConfig } from '../types'

export const browserConfig: BrowserConfig = {
  headless: false,
  defaultViewport: {
    width: 1280,
    height: 800,
  },
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
  ],
}

export const config: Config = {
  baseUrl: 'https://www.google.com',
  delays: {
    betweenQueries: 500,
    afterTyping: 300,
    smallDelay: 100,
    mediumDelay: 300,
    largeDelay: 2000,
  },
}
