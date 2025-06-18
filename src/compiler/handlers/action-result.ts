import { StatementLog } from '../interpreter/execution-context.js'

export interface ActionResult<T> {
  success: boolean
  value?: T // If success and pertinent, the value returned by the action
  output?: string // path of the state variable affected by the action
  message?: string
  logs: StatementLog[]
  errors?: string[]
}
