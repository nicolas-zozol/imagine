import { StatementNode } from '../parser/ast.js'
import { CommandRegistry } from './command-registry.js'
import { ExpressionEvaluator } from './evaluators.js'
import { ExecutionContext } from './execution-context.js'

export class StatementExecutor {
  constructor(
    private registry: CommandRegistry,
    private evaluator = new ExpressionEvaluator(),
  ) {}

  async execute(
    statement: StatementNode,
    context: ExecutionContext,
  ): Promise<void> {
    const { package: pkg, name } = statement.command
    const id = `@${pkg.value}/${name.value}`
    const handler = this.registry.resolve(id)
    if (!handler) throw new Error(`Command not found: ${id}`)

    const args: Record<string, any> = {}
    for (const arg of statement.args) {
      args[arg.name.value] = this.evaluator.evaluate(arg.value, context)
    }

    const result = await handler.run(args, context)
    if (statement.output && result.success) {
      context.data[statement.output.value] = result.value
    }
  }
}
