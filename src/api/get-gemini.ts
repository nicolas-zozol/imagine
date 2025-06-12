import { GoogleGenAI } from '@google/genai'

export function getGeminiAiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('GEMINI_API_KEY is not set')
  }
  return key
}

export function getGemini() {
  const apiKey = getGeminiAiKey()
  return new GoogleGenAI({ apiKey })
}

export async function generate(prompt: string): Promise<string | undefined> {
  const gemini = getGemini()
  const response = await gemini.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  })
  const content = response.text
  return content
}
