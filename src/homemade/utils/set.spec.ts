import { describe, it, expect } from 'vitest'
import { ExecutionContext } from '../../compiler/interpreter/execution-context.js'
import { StatementExecutor } from '../../compiler/interpreter/statement-executor.js'
import { StatementNode } from '../../compiler/parser/ast.js'
import { buildStatementParser } from '../../compiler/parser/statement-parser.js'

import { Streams } from '@masala/parser'
import { registerAllCommandHandlers } from '../../compiler/handlers/register-handlers.js'

describe('StatementExecutor with parsed statement', () => {
  const registry = registerAllCommandHandlers()
  const executor = new StatementExecutor(registry)
  const parser = buildStatementParser()

  const baseContext: ExecutionContext = {
    env: { MODE: 'test' },
    data: {
      tweets: [{ id: 'a' }, { id: 'b' }],
      count: 42,
      users: ['a', 'b', 'c'],
      nested: {
        deep: {
          value: 99,
        },
      },
    },
    extra: {},
    meta: {
      history: [],
      tool: 'test',
    },
    user: {
      id: 'user-123',
      extra: {},
    },
    store: {},
    prompts: [],
  }

  it('should evaluate literal input and store in output', async () => {
    const dsl = '@utils/set input=3 output=finalCount'
    const result = parser.parse(Streams.ofString(dsl))
    expect(result.isAccepted()).toBe(true)

    const ast = result.value as StatementNode
    const context = structuredClone(baseContext)

    await executor.execute(ast, context)
    expect(context.data.finalCount).toBe(3)
  })

  it('should evaluate identifier input from context.data and store in output', async () => {
    const dsl = '@utils/set input={count} output=backup'
    const result = parser.parse(Streams.ofString(dsl))
    expect(result.isAccepted()).toBe(true)

    const ast = result.value as StatementNode
    const context = structuredClone(baseContext)

    await executor.execute(ast, context)
    expect(context.data.backup).toBe(42)
  })

  /*
  it('should evaluate expression input like {users:tail:2}', async () => {
    const dsl = '@utils/set input={users:tail:2} output=recentUsers'
    const result = parser.parse(Streams.ofString(dsl))
    expect(result.isAccepted()).toBe(true)

    const ast = result.value as StatementNode
    const context = structuredClone(baseContext)

    await executor.execute(ast, context)
    expect(context.data.recentUsers).toEqual(['b', 'c'])
  })*/
})
