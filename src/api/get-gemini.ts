export function getGeminiAiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  return key
}
