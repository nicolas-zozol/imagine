import { C, F, GenLex, SingleParser } from '@masala/parser'
import { ArgTokens, createArgGrammar } from './arg-parser.js'
import { CommandNode, ArgumentNode, IdentifierNode } from './ast.js'
import { CommandTokens, createCommandGrammar } from './command-parser.js'
import { identifier } from './shared-parser.js'

export interface StatementTokens extends ArgTokens, CommandTokens {}

export function createStatementGrammar(tokens: StatementTokens) {
  const arg = createArgGrammar(tokens)
  const command = createCommandGrammar(tokens)

  const statement = command.then(arg.optrep()).map((t) => ({
    type: 'statement',
    command: t.first(),
    args: t.array().slice(1) as ArgumentNode[],
  }))
}

function extractOutputFromArgs(
  args: ArgumentNode[],
): IdentifierNode | undefined {
  const outputArg = args.find((arg) => arg.name.value === 'output')
  if (outputArg) {
    const output = outputArg as ArgumentNode
    if (output.value.type === 'identifier') {
      return {
        type: 'identifier',
        value: output.value.value,
      }
    }
  }
  return undefined
}
