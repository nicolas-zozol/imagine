import { describe, it, expect } from 'vitest'
import {
  IdentifierNode,
  LiteralStringNode,
  PipeExpressionNode,
} from '../parser/ast.js'
import { ExpressionEvaluator } from './evaluators.js'
import { ExecutionContext } from './execution-context.js'

const evaluator = new ExpressionEvaluator()

const baseContext: ExecutionContext = {
  env: {
    ENV_NAME: 'dev',
  },
  data: {
    tweets: [{ id: 'a' }, { id: 'b' }],
    names: ['john', 'mary'],
    count: 3,
  },
  extra: {},
  meta: {
    tool: 'test-runner',
    history: [],
  },
  user: {
    id: 'john@doe.com',
    extra: {},
  },
  store: {},
  prompts: [],
}

describe('ExpressionEvaluator', () => {
  it('should evaluate a literal string', () => {
    const expr: LiteralStringNode = { type: 'literal-string', value: 'hello' }
    expect(evaluator.evaluate(expr, baseContext)).toBe('hello')
  })

  it('should evaluate an identifier', () => {
    const expr: IdentifierNode = { type: 'identifier', value: 'names' }
    expect(evaluator.evaluate(expr, baseContext)).toEqual(['john', 'mary'])
  })

  /*it('should evaluate a pipe with mappedBy', () => {
    const expr: PipeExpressionNode = {
      type: 'pipe',
      input: { type: 'identifier', value: 'tweets' },
      name: 'mappedBy',
      args: [{ type: 'literal-string', value: 'id' }],
    }

    expect(evaluator.evaluate(expr, baseContext)).toEqual(['a', 'b'])
  })

  it('should evaluate a pipe with tail', () => {
    const expr: PipeExpressionNode = {
      type: 'pipe',
      input: { type: 'identifier', value: 'names' },
      name: 'tail',
      args: [{ type: 'literal-number', value: 1 }],
    }

    expect(evaluator.evaluate(expr, baseContext)).toEqual(['mary'])
  })*/

  it('should return input unchanged for pipe with no name', () => {
    const expr: PipeExpressionNode = {
      type: 'pipe',
      input: { type: 'identifier', value: 'count' },
      args: [],
    }

    expect(evaluator.evaluate(expr, baseContext)).toEqual(3)
  })
})
