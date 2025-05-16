import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { MCPServerCommand } from './command.js'

interface MCPToolResult {
  content: Array<{
    type: string
    text: string
  }>
}

export class FilesystemClient {
  private client: Client
  private transport: StdioClientTransport

  constructor(command: MCPServerCommand) {
    this.transport = new StdioClientTransport(command)
    this.client = new Client({
      name: 'mcp-filesystem-client',
      version: '0.1.0',
    })
    this.client.onclose = () => {
      console.log('### Client closed')
    }
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

  async readFile(filePath: string): Promise<string> {
    try {
      const result = (await this.client.callTool({
        name: 'read_file',
        arguments: {
          path: filePath,
        },
      })) as MCPToolResult

      // The result should contain the file contents in the content array
      if (result.content && result.content.length > 0) {
        return result.content[0].text
      }

      throw new Error('No content returned from read_file tool')
    } catch (error) {
      throw new Error(`Failed to read file: ${error}`)
    }
  }
}
