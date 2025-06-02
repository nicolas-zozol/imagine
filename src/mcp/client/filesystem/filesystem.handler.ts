import { ActionResult } from '../../../compiler/handlers/action-result.js'
import { BaseCommandHandler } from '../../../compiler/handlers/base-command-handler.js'
import { errorToString } from '../../../utils/error-to-string.js'
import { FilesystemClient } from './filesystem.client.js'

export class FileSystemWriterHandler extends BaseCommandHandler<void> {
  async run(
    args: Record<string, any>,
    context: any,
  ): Promise<ActionResult<void>> {
    const filePath = args.path as string
    const content = args.content as string

    return this.writeFile(filePath, content)
  }

  async writeFile(
    filePath: string,
    content: string,
  ): Promise<ActionResult<void>> {
    try {
      await new FilesystemClient().writeFile(filePath, content)
      return this.handleSuccess('loaded correctly')
    } catch (e) {
      throw this.handleError(errorToString(e))
    }
  }
}
