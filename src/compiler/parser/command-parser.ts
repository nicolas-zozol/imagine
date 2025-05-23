/**
 *
 * Parser for building the AST part of  args in a command line
 * @tweeter/users  ids={tweets:mappedBy:id} output = users
 *
 * @tweeter/users is the command
 * Some command will not use @package, but it's like a syntaxic sugar
 * and we could add that default package at the start of the line
 * if that line don't start with @
 */

import { C, F, GenLex, SingleParser } from '@masala/parser'
import { CommandNode } from './ast.js'
import { identifier } from './shared-parser.js'

interface Command {
  type: 'command'
  package: string
  name: string
}

const command: SingleParser<Command> = C.char('@')
  .drop()
  .then(identifier)
  .then(C.char('/').drop())
  .then(identifier)
  .map((t) => ({
    type: 'command',
    package: t.first(),
    name: t.last(),
  }))

export interface CommandTokens {
  COMMAND: SingleParser<Command>
}

export function createCommandTokens(genlex: GenLex): {
  COMMAND: SingleParser<Command>
} {
  const COMMAND = genlex.tokenize(command, 'COMMAND', 1000)
  return {
    COMMAND,
  }
}

export function createCommandGrammar(
  tokens: CommandTokens,
): SingleParser<CommandNode> {
  const { COMMAND } = tokens
  return COMMAND.map((c) => ({
    type: 'command',
    package: {
      type: 'identifier',
      value: c.package,
    },
    name: {
      type: 'identifier',
      value: c.name,
    },
  })) as SingleParser<CommandNode>
}

export function buildCommandParserForTest(): SingleParser<CommandNode> {
  const genlex = new GenLex()
  const tokens = createCommandTokens(genlex)
  const grammar = createCommandGrammar(tokens)
  return genlex.use(grammar)
}
