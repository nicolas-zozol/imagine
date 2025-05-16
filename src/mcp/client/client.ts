import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { z } from 'zod'

// Define command line arguments schema
const argsSchema = z.object({
  server: z.enum(['filesystem', 'postgres']),
  path: z.string().optional(),
  url: z.string().optional(),
})

// Parse command line arguments
const args = argsSchema.parse({
  server: process.argv
    .find((arg) => arg.startsWith('--server='))
    ?.split('=')[1],
  path: process.argv.find((arg) => arg.startsWith('--path='))?.split('=')[1],
  url: process.argv.find((arg) => arg.startsWith('--url='))?.split('=')[1],
})

// Configure server command based on type
const getServerCommand = () => {
  switch (args.server) {
    case 'filesystem':
      if (!args.path)
        throw new Error('--path is required for filesystem server')
      return {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-filesystem', args.path],
      }
    case 'postgres':
      if (!args.url) throw new Error('--url is required for postgres server')
      return {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-postgres', args.url],
      }
    default:
      throw new Error(`Unknown server type: ${args.server}`)
  }
}

async function main() {
  try {
    // Create transport and client
    const transport = new StdioClientTransport(getServerCommand())
    const client = new Client({ name: 'mcp-client', version: '0.1.0' })

    // Connect to the server
    console.log('Connecting to MCP server...')
    await client.connect(transport)
    console.log('Connected successfully!')

    // Try to fetch and print available tools
    try {
      console.log('\nAvailable Tools:')
      const tools = await client.listTools()
      console.log(JSON.stringify(tools, null, 2))
    } catch (error) {
      console.log('Tools not supported by this server')
    }

    // Try to fetch and print available prompts
    try {
      console.log('\nAvailable Prompts:')
      const prompts = await client.listPrompts()
      console.log(JSON.stringify(prompts, null, 2))
    } catch (error) {
      console.log('Prompts not supported by this server')
    }

    // For filesystem server, try to list files in the directory
    if (args.server === 'filesystem') {
      try {
        console.log('\nFiles in directory:')
        const result = await client.callTool({
          name: 'list',
          arguments: {
            path: args.path
          }
        })
        console.log(JSON.stringify(result, null, 2))
      } catch (error) {
        console.log('Error listing files:', error)
      }
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
