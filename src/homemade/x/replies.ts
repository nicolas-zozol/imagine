//import function getGemini()
//import function getGeminiAiKey()
import dotenv from 'dotenv'
import { generate } from '../../api/get-gemini.js'

/*function getTweets(): string[] {
  transformer les tweet+id etc en un tableau de string avec juste les tweets
  return tweets
}*/

export async function generateRepliesForTweet(
  tweets: string[],
): Promise<string[]> {
  const prompt = `You are a helpful marketing strategist. 
I will give you a tweet, and you will make a nice positive
 and a bit funny answer about formula one.
  You know what happened during 2023, 2024 and 2025 seasons, 
  as well as the long history of F1. DO in about 200 chars a reply for this tweet : `
  let response: string[] = []

  for (const tweet of tweets) {
    let request = await generate(prompt + tweet + ' . Just answer now.')
    if (typeof request !== 'string') {
      throw new Error('request is not a string')
    }
    response.push(request)
  }
  return response
}
