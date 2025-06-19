import { ExecutionContext } from '../compiler/interpreter/execution-context.js'
import { Serializable } from '../utils/loggable.js'

export interface Timeable {
  createdAt: Date
  updatedAt: Date
  archivedAt?: Date
}

export interface User extends Timeable {
  id: string
  email: string
  image?: string
  memberCreated: boolean // controls if the related member Object is made
  status: 'registered' | 'member' | 'pro' | 'archived'
}

export interface Team extends Timeable {
  id: string
  name: string
}

// Someone who currently pays
export interface Member {
  user: User
}

export interface Organization extends Timeable {
  users: User[]
}

export interface IFlow extends Timeable {
  id: string
  name: string
  team: Team | undefined
  owner: User
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
