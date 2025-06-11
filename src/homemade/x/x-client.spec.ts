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
  it('should connect to X', async () => {
    const client = new XClient(context)
    await client.connect()
    expect(client.isConnected).toBe(true)
  })
})
