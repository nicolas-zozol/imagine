//import function getGemini()
//import function getGeminiAiKey()
import dotenv from 'dotenv'
import { generate } from '../../api/get-gemini.js'
import { Reply, Tweet } from './tweet.js'
import { XClient } from './x-client.js'

export async function getTweets(query: string, max: number): Promise<Tweet[]> {
  const twitterClient = new XClient()
  const tweets = await twitterClient.search(query)

  return tweets
}

export async function generateRepliesForTweet(
  tweets: Tweet[],
): Promise<Reply[]> {
  const prompt = `You are a helpful marketing strategist. 
I will give you a tweet, and you will make a nice positive
 and a bit funny answer about formula one.
  You know what happened during 2023, 2024 and 2025 seasons, 
  as well as the long history of F1. DO in about 200 chars a reply for this tweet : `
  let response: Reply[] = []

  for (const tweet of tweets) {
    console.log(`Generating reply for tweet: ${tweet.text}`)
    let generatedReply = await generate(
      prompt + tweet.text + ' . Just answer now.',
    )
    if (typeof generatedReply !== 'string') {
      throw new Error('request is not a string')
    }
    response.push({
      tweet_id: tweet.id,
      text: generatedReply,
      type: 'reply',
    })
  }
  return response
}
export async function generateRepliesForTweetsAndPrompts(
  tweets: Tweet[],
  prompts: string[],
  repliesNumber: number,
  waitBetweenAIRequests = 0,
) {
  let response: Reply[] = []

  for (const tweet of tweets) {
    for (const prompt of prompts) {
      for (let i = 0; i < repliesNumber; i++) {
        let generatedReply = await generate(
          prompt + tweet.text + ' . Just answer now.',
        )
        if (typeof generatedReply !== 'string') {
          throw new Error('request is not a string')
        }
        response.push({
          tweet_id: tweet.id,
          text: generatedReply,
          type: 'reply',
        })
        await wait(waitBetweenAIRequests)
      }
    }
  }
  return response
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
