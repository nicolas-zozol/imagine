import OpenAI from 'openai'
import { getOpenAi } from '../get-open-ai-key.js'

export async function createImage(prompt: string): Promise<string | null> {
  const openai = getOpenAi()

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    size: '256x256',
    n: 1,
  })
  let result: string | null = null
  if (response.data && response.data.length > 0 && response.data[0].url) {
    result = response.data[0].url
  }
  return result
}
