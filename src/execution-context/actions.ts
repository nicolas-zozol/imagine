export interface Action {
  name: string
  description: string
  params?: {
    name: string
    type: string
    description: string
  }[]
}

export interface ActionHandler {
  execute(params: string[]): Promise<void>
}

export interface ActionResult {
  success: boolean
  message: string
  data?: any
}
