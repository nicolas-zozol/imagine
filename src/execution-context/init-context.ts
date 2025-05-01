import { ExecutionContext } from './execution-context.js'

export function initContext(envKeys: string[] = []): ExecutionContext {
  let env: Record<string, string> = {}
  envKeys.forEach((key) => {
    env[key] = process.env[key] || ''
  })

  return {
    state: {},
    env,
    meta: {
      tool: undefined,
      history: [],
      errors: [],
      warnings: [],
      extra: {},
    },
    extra: {},
    update(actionResult) {
      if (actionResult.success) {
        this.meta.history.push(...actionResult.logs)
      } else {
        this.meta.errors.push(actionResult.message || 'error')
      }

      if (actionResult.value) {
        this.state = actionResult.value
      }
      return this
    },
  }
}
