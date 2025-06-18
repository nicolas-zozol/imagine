import OpenAI from 'openai'

export function getOpenAiKey(): string {
  const key = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_PROD
  if (!key) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  return key
}

export function getOpenAi() {
  const apiKey = getOpenAiKey()
  return new OpenAI({
    apiKey,
  })
}
