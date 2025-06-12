import dotenv from 'dotenv'
import { describe, it, expect } from 'vitest'
import { generateRepliesForTweet, getTweets } from '../homemade/x/replies.js'
import { generate } from './get-gemini.js'

dotenv.config()
const prompt = `You are a helpful marketing strategist. 
I will give you a tweet, and you will make a nice positive
 and a bit funny answer about formula one.
  You know what happened during 2023, 2024 and 2025 seasons, 
  as well as the long history of F1. DO in about 200 chars a reply for this tweet : `

describe('Gemini AI', async () => {
  it('should generate a response for a tweet', async () => {
    const tweet = `I can't believe how fast the new F1 cars are this year!`
    const content = await generate(prompt + tweet + ' . Just answer now.')
    expect(content).toBeDefined()
    expect(content).toContain('F1')
    console.log(`Generated content: ${content}`)
  })

  it('should handle multiple tweets', async () => {
    const tweets = await getTweets(
      `Piastri lang:en min_faves:10 -min_replies:30`,
      5,
    )
    const replies = await generateRepliesForTweet(tweets)
    expect(replies.length).toBeGreaterThan(4)
    console.log('Generated replies:', replies)
  })
})
