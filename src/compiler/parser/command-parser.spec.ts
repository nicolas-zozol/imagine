import { describe, it, expect } from 'vitest'
import { F, Streams } from '@masala/parser'
import { buildCommandParserForTest } from './command-parser.js'

describe('Genlex for command parser', () => {
  const grammar = buildCommandParserForTest()
  it('should accept a simple command', () => {
    const stream = Streams.ofString('@package/name')
    const parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual({
      type: 'command',
      package: { type: 'identifier', value: 'package' },
      name: { type: 'identifier', value: 'name' },
    })
  })

  it('should decline bad commands', () => {
    let stream = Streams.ofString('@package name')
    let parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(false)

    stream = Streams.ofString('@package/ name')
    parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(false)

    stream = Streams.ofString('package/name')
    parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(false)
  })
})
