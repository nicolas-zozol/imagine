import dotenv from 'dotenv'
import { describe, it, expect } from 'vitest'
import { ExecutionContext } from '../../compiler/interpreter/execution-context.js'
import { XClient } from './x-client.js'

dotenv.config()

const context: ExecutionContext = {
  env: {
    'x-login': process.env['X_LOGIN'],
    'x-password': process.env['X_PASSWORD'],
  },
} as any

describe('XClient', () => {
  //TEST SUIT

  it('should search to X', async () => {
    // UT, Unit TEST
    const client = new XClient()
    const tweets = await client.search('Piastri')
    expect(tweets.length).toBeGreaterThan(5)
  })
})
