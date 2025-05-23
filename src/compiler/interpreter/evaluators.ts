// Expression Evaluator
import { CallExpressionNode, ExpressionNode } from '../parser/ast.js'
import { ExecutionContext } from './execution-context.js'

export class ExpressionEvaluator {
  evaluate(expr: ExpressionNode, context: ExecutionContext): any {
    switch (expr.type) {
      case 'identifier':
        return context.data[expr.value]
      case 'literal-string':
      case 'literal-number':
      case 'literal-boolean':
        return expr.value
      case 'call':
        return this.evaluateCall(expr, context)
      default:
        throw new Error(`Unknown expression type: ${(expr as any).type}`)
    }
  }

  private evaluateCall(
    expr: CallExpressionNode,
    context: ExecutionContext,
  ): any {
    const args = expr.args.map((arg) => this.evaluate(arg, context))
    switch (expr.name) {
      case 'mappedBy':
        return args[0]?.map((item: any) => item[args[1]])
      case 'orderBy':
        return [...args[0]].sort((a, b) => a[args[1]] - b[args[1]])
      case 'tail':
        return args[0].slice(-args[1])
      case 'concat':
        return args.flat()
      default:
        throw new Error(`Unknown operation: ${expr.name}`)
    }
  }
}
