import { TwitterApiResponse, Tweet } from './tweet.js'

interface TwitterLoginRequest {
  username_or_email: string
  password: string
  proxy: string
}

interface TwitterLoginResponse {
  status: 'success' | 'error'
  message: string
  access_token?: string
  user_info?: {
    id: string
    username: string
    name: string
  }
}

export class XClient {
  twitterIoAccessToken: string | null = null

  constructor() {
    this.twitterIoAccessToken = process.env['TWITTER_API_IO_KEY'] || null
  }

  async search(query: string): Promise<Tweet[]> {
    if (!this.twitterIoAccessToken) {
      throw new Error('Twitter API IO access token is required')
    }

    if (!query.trim()) {
      throw new Error('Search query cannot be empty')
    }

    try {
      const searchUrl = new URL(
        'https://api.twitterapi.io/twitter/tweet/advanced_search',
      )
      searchUrl.searchParams.append('query', query)

      const options = {
        method: 'GET',
        headers: {
          'X-API-Key': this.twitterIoAccessToken,
        },
      }

      const response = await fetch(searchUrl.toString(), options)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const searchResponse: TwitterApiResponse = await response.json()

      if (searchResponse.status === 'error') {
        throw new Error(`Search failed: ${searchResponse.message}`)
      }

      return searchResponse.tweets
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Search failed: ${error.message}`)
      }
      throw new Error('Search failed with unknown error')
    }
  }
}
