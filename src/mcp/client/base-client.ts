import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { MCPServerCommand } from './command.js'

export abstract class BaseClient {
  client: Client
  transport: StdioClientTransport

  protected constructor(command: MCPServerCommand) {
    this.transport = new StdioClientTransport(command)
    this.client = new Client({ name: 'mcp-client', version: '0.1.0' })
  }
}
