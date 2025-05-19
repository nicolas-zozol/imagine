import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { BaseClient } from './base-client.js'
import { MCPServerCommand } from './command.js'

interface MCPToolResult {
  content: Array<{
    type: string
    text: string
  }>
}

export class FilesystemClient extends BaseClient {
  constructor(command: MCPServerCommand) {
    super(command, 'mcp-filesystem-client')

    this.client.onclose = () => {
      console.log('### Client closed')
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
