import { ActionLog } from './execution-context.js'

export interface Action {
  name: string
  description: string
  params?: {
    name: string
    type: string
    description: string
  }[]
}

export interface ActionHandler<T> {
  execute(params: string[]): Promise<ActionResult<T>>
}

export interface ActionResult<T> {
  success: boolean
  value?: T // If success and pertinent, the value returned by the action
  path?: string // path of the state variable affected by the action
  message?: string
  logs: ActionLog[]
}
