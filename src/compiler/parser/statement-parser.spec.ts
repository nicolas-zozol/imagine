import { describe, it, expect } from 'vitest'
import { F, Streams } from '@masala/parser'
import { buildCommandParserForTest } from './command-parser.js'
import { buildStatementParserForTest } from './statement-parser.js'

describe('Genlex for statement parser', () => {
  it('should accept a full statement', () => {
    let statement = '@package/name arg1 = val1 output = out1'
    let stream = Streams.ofString(statement)
    let grammar = buildStatementParserForTest()
    let parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual({
      type: 'statement',
      command: {
        type: 'command',
        package: { type: 'identifier', value: 'package' },
        name: { type: 'identifier', value: 'name' },
      },
      args: [
        {
          type: 'argument',
          name: { type: 'identifier', value: 'arg1' },
          value: { type: 'identifier', value: 'val1' },
        },
      ],
      output: {
        type: 'identifier',
        value: 'out1',
      },
    })
  })
})
