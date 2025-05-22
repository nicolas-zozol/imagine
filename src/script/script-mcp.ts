import dotenv from 'dotenv'
import { combineMcps } from '../mcp/client/combination.js'

dotenv.config()

async function runScriptMCP() {
  console.log('Running script MCP...')
  await combineMcps()
}

runScriptMCP().catch(console.error)
