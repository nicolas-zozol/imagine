import { describe, it, expect } from 'vitest'
import { Streams } from '@masala/parser'
import { buildArgParser } from './arg-parser.js'

describe('Genlex for arg parser', () => {
  const grammar = buildArgParser()

  it('should accept a valid argument', () => {
    const stream = Streams.ofString('arg1 = val1')
    const parsing = grammar.parse(stream)
    expect(parsing.isAccepted()).toBe(true)
    expect(parsing.value).toEqual({
      name: 'arg1',
      value: 'val1',
    })
  })
})
