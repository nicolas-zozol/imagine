import { C, F, GenLex, SingleParser } from '@masala/parser'
import {
  ArgTokens,
  createArgGrammar,
  createArgumentTokens,
} from './arg-parser.js'
import {
  ArgumentNode,
  CommandNode,
  IdentifierNode,
  StatementNode,
} from './ast.js'
import {
  CommandTokens,
  createCommandGrammar,
  createCommandTokens,
} from './command-parser.js'

export interface StatementTokens extends ArgTokens, CommandTokens {}

function getStatementTokens(genlex: GenLex): StatementTokens {
  return {
    ...createCommandTokens(genlex),
    ...createArgumentTokens(genlex),
  }
}

export function createStatementGrammar(
  tokens: StatementTokens,
): SingleParser<StatementNode> {
  const arg = createArgGrammar(tokens)
  const command = createCommandGrammar(tokens)

  const statement = command.then(arg.optrep()).map((t) => {
    const command = t.first()
    const args = t.array().slice(1) as ArgumentNode[]
    const { output, args: argsWithoutOutput } = extractOutputFromArgs(args)
    const statementNode: StatementNode = {
      type: 'statement',
      command,
      args: argsWithoutOutput,
      output,
    }
    return statementNode
  })
  return statement as SingleParser<StatementNode>
}

function extractOutputFromArgs(args: ArgumentNode[]): {
  output: IdentifierNode | undefined
  args: ArgumentNode[]
} {
  const outputArg = args.find((arg) => arg.name.value === 'output')
  if (outputArg) {
    const output = outputArg as ArgumentNode
    const argsWithoutOutput = args.filter((arg) => arg.name.value !== 'output')
    if (output.value.type === 'identifier') {
      return {
        output: { type: 'identifier', value: output.value.value },
        args: argsWithoutOutput,
      }
    }
  }
  return {
    output: undefined,
    args: args,
  }
}

export function buildStatementParserForTest(): SingleParser<StatementNode> {
  const genlex = new GenLex()
  const tokens = getStatementTokens(genlex)
  const grammar = createStatementGrammar(tokens)
  return genlex.use(grammar)
}

export function buildStatementParser(): SingleParser<StatementNode> {
  const genlex = new GenLex()
  const tokens = getStatementTokens(genlex)
  return genlex.use(createStatementGrammar(tokens))
}
