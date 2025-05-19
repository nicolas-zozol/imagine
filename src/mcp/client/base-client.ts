import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { MCPServerCommand } from './command.js'

export abstract class BaseClient {
  public client: Client
  protected transport: StdioClientTransport

  protected constructor(command: MCPServerCommand, name: string) {
    this.transport = new StdioClientTransport(command)
    this.client = new Client({ name, version: '0.1.0' })
  }

  async connect(): Promise<void> {
    await this.client.connect(this.transport)
  }

  async shutdown(): Promise<void> {
    try {
      // First close the client connection
      await this.client.close()

      // Then close the transport which will terminate the child process
      await this.transport.close()
    } catch (error) {
      console.error('Error during shutdown:', error)
    }
  }
}
