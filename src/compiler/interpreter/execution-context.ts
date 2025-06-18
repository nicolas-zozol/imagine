import { Serializable } from '../../utils/loggable.js'

export type Timestamp = string // ISO 8601 format

export interface ExecutionContext {
  env: Record<string, string>
  data: Record<string, any>
  extra: any
  meta: {
    tool?: string
    history: StatementLog[]
  }
  user: {
    id: string
    extra: Serializable
  }
}

export interface StatementLog {
  success: boolean
  statement: string
  message?: string
  start: Timestamp
  end: Timestamp
  errors?: string[]
}

export function createExecutionContext(
  userId: string,
  extra: Serializable = {},
): ExecutionContext {
  return {
    env: {},
    data: {},
    extra,
    meta: {
      tool: undefined,
      history: [],
    },
    user: {
      id: userId,
      extra: {},
    },
  }
}
