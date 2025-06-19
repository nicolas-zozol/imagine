import { ExecutionContext } from '../compiler/interpreter/execution-context.js'
import { Serializable } from '../utils/loggable.js'

export interface Timeable {
  createdAt: Date
  updatedAt: Date
  archivedAt?: Date
}

export interface UserDto extends Timeable {
  readonly id: string
  email: string
  image?: string
  memberCreated: boolean // controls if the related member Object is made
  status: 'registered' | 'member' | 'pro' | 'archived'
}

export interface TeamDto extends Timeable {
  id: string
  name: string
}

// Someone who currently pays
export interface MemberDto {
  user: UserDto
}

export interface OrganizationDto extends Timeable {
  users: UserDto[]
}

export interface FlowDto extends Timeable {
  id: string
  name: string
  team: TeamDto | undefined
  owner: UserDto
  description: string
  state: 'draft' | 'active' | 'archived'
  context: ExecutionContext
  instructions: string[]
  currentInstructionIndex: number
  isRunning: boolean
  isPaused: boolean
  successfulCompletions: number
  errors: string[]
}

export type Store = Serializable
