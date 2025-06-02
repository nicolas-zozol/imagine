import { ActionResult } from '../../compiler/handlers/action-result.js'
import { BaseCommandHandler } from '../../compiler/handlers/base-command-handler.js'
import { ExecutionContext } from '../../compiler/interpreter/execution-context.js'

export class SetHandler extends BaseCommandHandler<void> {
  async run(
    args: Record<string, any>,
    context: ExecutionContext,
  ): Promise<ActionResult<void>> {
    const input = args.input as any
    const output = args.output as string

    if (input === undefined || output === undefined) {
      throw new Error('Input and output are required')
    }
    return this.set(context, input, output)
  }

  async set(
    context: ExecutionContext,
    input: any,
    output: string,
  ): Promise<ActionResult<void>> {
    context.data[output] = input
    return this.handleSuccess(`Set ${output} successfully`)
  }
}
