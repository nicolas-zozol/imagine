import dotenv from 'dotenv'
import { FetchClient } from '../mcp/client/fetch/fetch.client.js'
dotenv.config()

async function runScriptFetch() {
  const client = new FetchClient()
  const web = await client.fetch(
    'https://www.robusta.build/learn/blockchain/s/the-source-of-yield-farming-profits',
    10000,
    0,
    false,
  )
  console.log({ web })
  await client.shutdown()
}

runScriptFetch().catch(console.error)
