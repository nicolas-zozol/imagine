import { BaseClient } from './base-client.js'
import { MCPServerCommand } from './command.js'

interface MCPToolResult {
  content: Array<{
    type: string
    text: string
  }>
}

export class PostgresClient extends BaseClient {
  constructor(command: MCPServerCommand) {
    super(command, 'mcp-postgres-client')
  }

  /**
   * Execute a read-only SQL query
   * @param sql The SQL query to execute
   * @returns The query results as a string
   */
  async query(sql: string): Promise<string> {
    try {
      const result = (await this.client.callTool({
        name: 'query',
        arguments: {
          sql,
        },
      })) as MCPToolResult

      // The result should contain the query results in the content array
      if (result.content && result.content.length > 0) {
        console.log(result.content)
        return result.content[0].text
      }

      throw new Error('No results returned from query tool')
    } catch (error) {
      throw new Error(`Failed to execute query: ${error}`)
    }
  }
}
