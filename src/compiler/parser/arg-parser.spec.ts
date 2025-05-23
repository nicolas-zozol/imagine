import { describe, it, expect } from 'vitest'
import { F, Streams } from '@masala/parser'
import { buildArgParserForTests, simpleString } from './arg-parser.js'
import { identifier } from './shared-parser.js'

describe('Simple cases', () => {
  it('should parse a simple regex', () => {
    let stream = Streams.ofString('arg1')
    let parsing = identifier.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual('arg1')

    stream = Streams.ofString('10arg1!')
    parsing = simpleString.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual('10arg1!')

    stream = Streams.ofString('users')
    parsing = simpleString.parse(stream)
    expect(parsing.isAccepted()).toBe(false)

    stream = Streams.ofString('users/10')
    parsing = simpleString.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
  })

  it('should parse a identifier', () => {
    const stream = Streams.ofString('arg_-1')
    const parsing = identifier.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual('arg_-1')

    const stream2 = Streams.ofString('arg1-')
    const parsing2 = identifier.parse(stream2)
    expect(parsing2.isAccepted()).toBe(false)
  })
})

describe('Genlex for arg parser', () => {
  const grammar = buildArgParserForTests()

  it('should accept a simple argument', () => {
    const stream = Streams.ofString('arg1 = val1')
    const parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual({
      type: 'argument',
      name: { type: 'identifier', value: 'arg1' },
      value: { type: 'identifier', value: 'val1' },
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

describe('Filter output for arg parser', () => {
  it('should accept a output argument', () => {
    const stream = Streams.ofString('output = users')
    const parsing = buildArgParserForTests().parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual({
      type: 'argument',
      name: { type: 'identifier', value: 'output' },
      value: { type: 'identifier', value: 'users' },
    })
  })

  it('should NOT accept a output argument that is not an identifier', () => {
    let stream = Streams.ofString('output = "arg1"')
    let parsing = buildArgParserForTests().parse(stream)
    expect(parsing.isAccepted()).toBe(false)

    stream = Streams.ofString('output = 10')
    parsing = buildArgParserForTests().parse(stream)
    expect(parsing.isAccepted()).toBe(false)

    stream = Streams.ofString('output = 10asString')
    parsing = buildArgParserForTests().parse(stream)
    expect(parsing.isAccepted()).toBe(false)

    stream = Streams.ofString('output = {action:10} ')
    parsing = buildArgParserForTests().parse(stream)
    expect(parsing.isAccepted()).toBe(false)
  })

  it('should NOT accept empty value', () => {
    const stream = Streams.ofString('output = ')
    const parsing = buildArgParserForTests().parse(stream)
    expect(parsing.isAccepted()).toBe(false)
  })
})
