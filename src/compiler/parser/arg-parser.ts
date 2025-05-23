/**
 *
 * Parser for building the AST part of  args in a command line
 * @tweeter/users  ids={tweets:mappedBy:id} output = users
 *
 * ids={tweets:mappedBy:id} and output = users  are both args
 *
 * So left is
 */

import { F, C, N, SingleParser, GenLex } from '@masala/parser'
import { ArgumentNode, IdentifierNode, LiteralNode } from './ast.js'
import { identifier, spaces } from './shared-parser.js'

const equal = C.char('=')

const quote = C.char('"')

const numberLiteral = N.number()
export const simpleString = F.regex(/[a-zA-Z_0-9-'`$&€£%!@.;?/+*]+/)
  .filter((v) => isNaN(Number(v)))
  .filter((value) => !identifier.thenEos().val(value))

const stringLiteral = quote
  .then(F.not(C.charIn('"\n')).rep())
  .then(quote)
  .join()

const anyLiteral = F.tryAll([
  stringLiteral,
  numberLiteral,
  simpleString,
  identifier,
])

const openBracket = C.char('{')
const closeBracket = C.char('}')
const colon = C.char(':')
const colonExpression = anyLiteral.then(colon.drop()).optrep().then(anyLiteral)

const fullExpression = openBracket
  .then(spaces.opt())
  .drop()
  .then(colonExpression)
  .then(spaces.opt().drop())
  .then(closeBracket.drop()) // as TupleParser<(string | number)[]>
  .array() as SingleParser<(string | number | boolean)[]>

export interface ArgTokens {
  EQUAL: SingleParser<string>
  IDENTIFIER: SingleParser<string>
  NUMBER_LITERAL: SingleParser<number>
  SIMPLE_STRING: SingleParser<string>
  STRING_LITERAL: SingleParser<string>
  FULL_EXPRESSION: SingleParser<(string | number | boolean)[]>
}

export function createArgumentTokens(genlex: GenLex): ArgTokens {
  const EQUAL = genlex.tokenize(equal, 'EQUAL', 100)

  const IDENTIFIER = genlex.tokenize(identifier, 'IDENTIFIER', 800)
  const SIMPLE_STRING = genlex.tokenize(simpleString, 'SIMPLE_STRING', 1200)
  const NUMBER_LITERAL = genlex.tokenize(numberLiteral, 'NUMBER_LITERAL', 1300)

  const STRING_LITERAL = genlex.tokenize(stringLiteral, 'STRING_LITERAL', 1200)
  //const OPEN_BRACKET = genlex.tokenize(openBracket, 'OPEN_BRACKET', 1000)
  //const CLOSE_BRACKET = genlex.tokenize(closeBracket, 'CLOSE_BRACKET', 1000)
  //const COLON = genlex.tokenize(colon, 'COLON', 1000)
  const FULL_EXPRESSION = genlex.tokenize(
    fullExpression,
    'FULL_EXPRESSION',
    5000,
  )
  return {
    EQUAL,
    IDENTIFIER,
    SIMPLE_STRING,
    NUMBER_LITERAL,
    STRING_LITERAL,
    FULL_EXPRESSION,
  }
}

export function createArgGrammar(
  tokens: ArgTokens,
): SingleParser<ArgumentNode> {
  const {
    EQUAL,
    IDENTIFIER,
    SIMPLE_STRING,
    NUMBER_LITERAL,
    STRING_LITERAL,
    FULL_EXPRESSION,
  } = tokens

  const identifier = IDENTIFIER.map((value) => ({
    type: 'identifier',
    value,
  })) as SingleParser<IdentifierNode>
  const stringLiteral = STRING_LITERAL.map((value) => ({
    type: 'literal-string',
    value: value.slice(1, -1),
  })) as SingleParser<LiteralNode>
  const numberLiteral = NUMBER_LITERAL.map((value) => ({
    type: 'literal-number',
    value: Number(value),
  })) as SingleParser<LiteralNode>
  const simpleString = SIMPLE_STRING.map((value) => ({
    type: 'literal-string',
    value,
  })) as SingleParser<LiteralNode>
  const identifierForString = IDENTIFIER.map((value) => ({
    type: 'identifier',
    value,
  })) as SingleParser<IdentifierNode>

  let ANY_LITERAL: SingleParser<LiteralNode | IdentifierNode> = F.tryAll([
    identifier,
    stringLiteral,
    numberLiteral,
    simpleString,
    identifierForString,
  ])

  ANY_LITERAL = ANY_LITERAL.map(literalMapper)

  const arg = identifier.then(EQUAL.drop()).then(ANY_LITERAL).debug('&&arg')

  const unfilteredParser = arg.map((tuple) => ({
    type: 'argument',
    name: { type: 'identifier', value: tuple.first().value },
    value: { type: tuple.last().type, value: tuple.last().value },
  })) as SingleParser<ArgumentNode>
  return filterOutputType(unfilteredParser)
}

export function buildArgParserForTests(): SingleParser<ArgumentNode> {
  const genlex = new GenLex()
  const tokens = createArgumentTokens(genlex)
  const grammar = createArgGrammar(tokens)
  return genlex.use(grammar)
}

function literalMapper(
  node: LiteralNode | IdentifierNode,
): LiteralNode | IdentifierNode {
  const value = node.value
  if (value === 'true') {
    return { type: 'literal-boolean', value: true }
  }
  if (value === 'false') {
    return { type: 'literal-boolean', value: false }
  }
  if (value === 'null') {
    return { type: 'literal-null', value: null }
  }
  return node
}

function filterOutputType(
  parser: SingleParser<ArgumentNode>,
): SingleParser<ArgumentNode> {
  return parser.filter((arg) => {
    if (arg.type === 'argument' && arg.name.value === 'output') {
      return arg.value.type === 'identifier'
    }
    return true
  })
}
