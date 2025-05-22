import fs from 'fs'
import path from 'path'

export interface Tweet {
  id: string
  text: string
  author_id: string
  created_at: string
  edit_history_tweet_ids?: string[]
}

export interface TwitterUser {
  id: string
  name: string
  username: string
  created_at: string
  description: string
  public_metrics: {
    followers_count: number
    following_count: number
    tweet_count: number
    listed_count: number
  }
}

export class TwitterClient {
  constructor(public userBearer: string) {
    if (!this.userBearer) {
      throw new Error('userBearer is not set')
    }
  }

  async searchSubject(query: string): Promise<Array<Tweet[]>> {
    //https://api.x.com/2/tweets/search/recent?query="MCP server"&max_results=70&tweet.fields=geo,created_at,author_id,text
    const url = `https://api.x.com/2/tweets/search/recent?query="${query}"&max_results=70&tweet.fields=geo,created_at,author_id,text`
    const headers = {
      Authorization: `Bearer ${this.userBearer}`,
    }
    const responseStream = await fetch(url, {
      method: 'GET',
      headers,
    })
    if (!responseStream.ok) {
      throw new Error(`Error fetching data: ${responseStream.statusText}`)
    }
    const response = await responseStream.json()
    if (!response || !response.data) {
      throw new Error('No data found')
    }

    const allTweets = response.data as Tweet[]
    // save data into twitter-live-result.json

    const filePath = path.join(__dirname, 'twitter-live-result.json')
    fs.writeFileSync(filePath, JSON.stringify(allTweets, null, 2), 'utf-8')
    console.log('Data saved to twitter-live-result.json')

    // Cut the data in chunks of 10 tweets
    const chunkSize = 10
    const chunks = []
    for (let i = 0; i < allTweets.length; i += chunkSize) {
      chunks.push(allTweets.slice(i, i + chunkSize))
    }

    return chunks
  }

  async searchUserIds(userIds: string[]): Promise<TwitterUser[] | any> {
    const url = `https://api.x.com/2/users?ids=${userIds.join(',')}&user.fields=created_at,description,public_metrics`
    const headers = {
      Authorization: `Bearer ${this.userBearer}`,
    }
    const responseStream = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!responseStream.ok) {
      throw new Error(`Error fetching data: ${responseStream.statusText}`)
    }
    const response = await responseStream.json()
    if (!response || !response.data) {
      throw new Error('No data found')
    }
    const allUsers = response.data as TwitterUser[]
    // save data into twitter-live-result.json
    const filePath = path.join(__dirname, 'twitter-live-users.json')
    fs.writeFileSync(filePath, JSON.stringify(allUsers, null, 2), 'utf-8')
    console.log('Data saved to twitter-live-users.json')
    return allUsers
  }
}
