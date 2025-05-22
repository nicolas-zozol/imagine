import { describe, it, expect } from 'vitest'
import { F, Streams } from '@masala/parser'
import { buildArgParser } from './arg-parser.js'

describe('Simple cases', () => {
  it('should parse a simple regex', () => {
    const identifier = F.regex(/[a-zA-Z_][a-zA-Z0-9_-]*/)
    const stream = Streams.ofString('arg1')
    const parsing = identifier.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual('arg1')

    const simpleString = F.regex(/[a-zA-Z_0-9-'`$&€£%!@.;?/+*]+/)
    const stream2 = Streams.ofString('10arg1!')
    const parsing2 = simpleString.parse(stream2)
    expect(parsing2.isAccepted()).toBe(true)
    expect(parsing2.value).toEqual('10arg1!')
  })
})

describe('Genlex for arg parser', () => {
  const grammar = buildArgParser()

  it('should accept a simple argument', () => {
    const stream = Streams.ofString('arg1 = val1')
    const parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual({
      type: 'argument',
      name: { type: 'identifier', value: 'arg1' },
      value: { type: 'literal-string', value: 'val1' },
    })
  })

  it('should accept a litteral string argument', () => {
    const stream = Streams.ofString('arg1 = "val1"')
    const parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual({
      type: 'argument',
      name: { type: 'identifier', value: 'arg1' },
      value: { type: 'literal-string', value: 'val1' },
    })
  })

  it('should accept a simple string_like argument', () => {
    const stream = Streams.ofString('arg1 = 10asString ')
    const parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual({
      type: 'argument',
      name: { type: 'identifier', value: 'arg1' },
      value: { type: 'literal-string', value: '10asString' },
    })
  })

  it('should accept a number argument', () => {
    const stream = Streams.ofString('arg1 = 10')
    const parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual({
      type: 'argument',
      name: { type: 'identifier', value: 'arg1' },
      value: { type: 'literal-number', value: 10 },
    })
  })

  it('should accept a number argument kept as string', () => {
    const stream = Streams.ofString('arg1 = "10" ')
    const parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual({
      type: 'argument',
      name: { type: 'identifier', value: 'arg1' },
      value: { type: 'literal-string', value: '10' },
    })
  })
})
