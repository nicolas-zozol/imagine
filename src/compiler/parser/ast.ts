export type LiteralNode =
  | LiteralStringNode
  | LiteralNumberNode
  | LiteralBooleanNode
  | LiteralNullNode

export interface LiteralStringNode {
  type: 'literal-string'
  value: string
}

export interface LiteralNumberNode {
  type: 'literal-number'
  value: number
}

export interface LiteralBooleanNode {
  type: 'literal-boolean'
  value: boolean
}

export interface LiteralNullNode {
  type: 'literal-null'
  value: null
}

export interface IdentifierNode {
  type: 'identifier'
  value: string
}

export interface CallExpressionNode {
  type: 'call'
  name: string // e.g. "mappedBy", "concat", "orderBy"
  args: ExpressionNode[] // e.g. [Identifier(tweets), Literal(id)]
}

export type ExpressionNode = IdentifierNode | LiteralNode | CallExpressionNode

export interface ArgumentNode {
  type: 'argument'
  name: IdentifierNode
  value: ExpressionNode
}

export interface CommandNode {
  type: 'command'
  command: IdentifierNode
  args: ArgumentNode[]
  output?: IdentifierNode
}

export interface ProgramNode {
  type: 'program'
  body: CommandNode[]
}

export type DslAstNode =
  | ProgramNode
  | CommandNode
  | ArgumentNode
  | ExpressionNode
