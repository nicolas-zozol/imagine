import { describe, it, expect } from 'vitest'
import { F, Streams } from '@masala/parser'
import { buildStatementParserForTest } from './statement-parser.js'

describe('Genlex for statement parser', () => {
  it('should accept a full statement', () => {
    let statement = '@package/name arg1 = 10 output = out1'
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
          value: { type: 'literal-number', value: 10 },
        },
      ],
      output: {
        type: 'identifier',
        value: 'out1',
      },
    })
  })

  it('checks that output is valid', () => {
    let statement = '@package/name arg1 = 10 output = 10'
    let stream = Streams.ofString(statement)
    let grammar = buildStatementParserForTest()
    let parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value.args.length).toEqual(1)
    expect(parsing.value.output).toBeUndefined()
  })
  it('should decline bad statements', () => {
    let statement = 'package/name arg1 = 10 output = out1'
    let stream = Streams.ofString(statement)
    const grammar = buildStatementParserForTest().thenEos()
    let parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(false)

    statement = '@package name arg1 = 10 output = out1'
    stream = Streams.ofString(statement)
    parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(false)

    statement = '@package/name arg1 = 10 output ='
    stream = Streams.ofString(statement)
    parsing = grammar.parse(stream)
    console.log(grammar.val(statement))
    expect(parsing.isAccepted()).toBe(false)

    statement = '@package/name arg1 = 10 output = out1 extra'
    stream = Streams.ofString(statement)
    parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(false)
  })
})
