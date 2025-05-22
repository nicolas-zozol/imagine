/**
 *
 * Parser for building the AST part of  args in a command line
 * @tweeter/users  ids={tweets:mappedBy:id} output = users
 *
 * ids={tweets:mappedBy:id} and output = users  are both args
 *
 * So left is
 */

import {
  F,
  C,
  N,
  SingleParser,
  TupleParser,
  GenLex,
  MixedParser,
} from '@masala/parser'

const spaces = C.char(' ').or(C.char('\t')).rep()

const equal = C.char('=').debug('EQUAL')
const identifier = F.regex(/[a-zA-Z_][a-zA-Z0-9_-]*/).debug('IDENTIFIER')

const numberLiteral = N.number()
const quote = C.char('"')
const stringLiteral = quote.then(F.not(quote).rep()).then(quote).join()

const anyLiteral = stringLiteral.or(numberLiteral).or(identifier)

const openBracket = C.char('{')
const closeBracket = C.char('}')
const colon = C.char(':')
const colonExpression = anyLiteral
  .then(colon.drop())
  .optrep()
  .then(anyLiteral)
  .debug('COLON_EXPRESSION')

const fullExpression = openBracket
  .then(spaces.opt())
  .drop()
  .then(colonExpression)
  .then(spaces.opt().drop())
  .then(closeBracket.drop()) // as TupleParser<(string | number)[]>
  .array() as SingleParser<(string | number)[]>

function createGenlex() {
  const genlex = new GenLex()
  return genlex
}

interface Arg {
  name: string
  values?: (string | number)[]
  value?: (string | number)[]
}

interface ArgTokens {
  EQUAL: SingleParser<string>
  IDENTIFIER: SingleParser<string>
  NUMBER_LITERAL: SingleParser<number>
  STRING_LITERAL: SingleParser<string>
  FULL_EXPRESSION: SingleParser<(string | number)[]>
}

function createTokens(genlex: GenLex): ArgTokens {
  const EQUAL = genlex.tokenize(equal, 'EQUAL', 100)
  const IDENTIFIER = genlex.tokenize(identifier, 'IDENTIFIER', 800)
  const STRING_LITERAL = genlex.tokenize(stringLiteral, 'STRING_LITERAL', 1200)
  const NUMBER_LITERAL = genlex.tokenize(numberLiteral, 'NUMBER_LITERAL', 1200)
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
    STRING_LITERAL,
    NUMBER_LITERAL,
    FULL_EXPRESSION,
  }
}

function createGrammar(tokens: ArgTokens): SingleParser<Arg> {
  const { EQUAL, IDENTIFIER, STRING_LITERAL, NUMBER_LITERAL, FULL_EXPRESSION } =
    tokens

  const ANY_LITERAL = STRING_LITERAL.or(NUMBER_LITERAL).or(IDENTIFIER)

  const arg = IDENTIFIER.debug('##1')
    .then(EQUAL.drop().debug('###2'))
    .then(ANY_LITERAL.debug('###3'))
    .array()

  return arg.map(([name, value]) => ({
    name,
    value,
  }))
}

export function buildArgParser(): SingleParser<Arg> {
  const genlex = createGenlex()
  const tokens = createTokens(genlex)
  const grammar = createGrammar(tokens)
  return genlex.use(grammar)
}
