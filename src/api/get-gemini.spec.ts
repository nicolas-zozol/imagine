import dotenv from 'dotenv'
import { describe, it, expect } from 'vitest'
import { generateRepliesForTweet } from '../homemade/x/response.js'
import { generate } from './get-gemini.js'

dotenv.config()
const prompt = `You are a helpful marketing strategist. 
I will give you a tweet, and you will make a nice positive
 and a bit funny answer about formula one.
  You know what happened during 2023, 2024 and 2025 seasons, 
  as well as the long history of F1. DO in about 200 chars a reply for this tweet : `

const tweets = [
  'Leclerc just overtook two cars in one corner. Ferrari might actually let him win this time 😭 #F1 #MonacoGP',
  "Radio from Verstappen: 'Tell Checo I said sorry… for being too fast.' 💀💀 #F1 #RedBullRacing",
  'Alonso P1 in Free Practice. That man refuses to age. Someone check his birth certificate fr. #F1 #ElPlan',
  "Mercedes bringing upgrades every weekend like it's a fashion show. Just give Lewis a rocket ship already. 🚀 #F1 #MercedesAMGF1",
  'McLaren dropped a banger livery but forgot to bring the pace. Again. 💔 #F1 #PapayaPain',
]

describe('Gemini AI', async () => {
  it('should generate a response for a tweet', async () => {
    const tweet = `I can't believe how fast the new F1 cars are this year!`
    const content = await generate(prompt + tweet + ' . Just answer now.')
    expect(content).toBeDefined()
    expect(content).toContain('F1')
    console.log(`Generated content: ${content}`)
  })

  it('should handle multiple tweets', async () => {
    const replies = await generateRepliesForTweet(tweets)
    expect(replies.length).toBeGreaterThan(4)
    console.log('Generated replies:', replies)
  })
})
