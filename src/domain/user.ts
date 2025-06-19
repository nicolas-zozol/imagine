/**
 * Simple class implementations for User, Team, Organization and Member.
 * Each class fulfils its corresponding interface while keeping logic minimal
 * and focused on high‑level domain concerns. A shared BaseTimeable handles
 * timestamp bookkeeping and basic archiving behaviour.
 */

// Import your interfaces; adjust the path as needed for your project structure.
// import type { Timeable, User, Team, Organization, Member } from "./domain-interfaces";

import {
  MemberDto,
  OrganizationDto,
  TeamDto,
  Timeable,
  UserDto,
} from './domain.js'

/** Basic implementation of the Timeable interface. */
export abstract class BaseTimeable implements Timeable {
  createdAt: Date
  updatedAt: Date
  archivedAt?: Date

  protected constructor() {
    const now = new Date()
    this.createdAt = now
    this.updatedAt = now
  }

  /** Update the `updatedAt` timestamp. */
  protected touch() {
    this.updatedAt = new Date()
  }

  /** Soft‑delete by setting the `archivedAt` field. */
  archive() {
    if (!this.archivedAt) {
      this.archivedAt = new Date()
      this.touch()
    }
  }
}

/**
 * Concrete implementation of the `User` domain object.
 */
export class UserEntity extends BaseTimeable implements UserDto {
  id: string
  email: string
  image?: string
  memberCreated: boolean
  status: 'registered' | 'member' | 'pro' | 'archived'

  constructor({
    id,
    email,
    image,
    memberCreated = false,
    status = 'registered',
  }: Omit<UserDto, 'createdAt' | 'updatedAt' | 'archivedAt'>) {
    super()
    this.id = id
    this.email = email
    this.image = image
    this.memberCreated = memberCreated
    this.status = status
  }

  promoteToMember() {
    if (this.status === 'registered') {
      this.status = 'member'
      this.memberCreated = true
      this.touch()
    }
  }

  upgradeToPro() {
    if (this.status === 'member') {
      this.status = 'pro'
      this.touch()
    }
  }
}

/**
 * Concrete implementation of the `Team` domain object.
 */
export class TeamEntity extends BaseTimeable implements TeamDto {
  id: string
  name: string

  constructor({
    id,
    name,
  }: Omit<TeamDto, 'createdAt' | 'updatedAt' | 'archivedAt'>) {
    super()
    this.id = id
    this.name = name
  }

  rename(newName: string) {
    this.name = newName
    this.touch()
  }
}

/**
 * Concrete implementation of the `Organization` domain object.
 */
export class OrganizationEntity
  extends BaseTimeable
  implements OrganizationDto
{
  users: UserDto[]

  constructor({ users = [] }: Partial<OrganizationDto> = {}) {
    super()
    this.users = users
  }

  hasUser(user: string | UserDto): boolean {
    const userId = typeof user === 'string' ? user : user.id
    return this.users.some((u) => u.id === userId)
  }

  addUser(user: UserDto) {
    if (!this.hasUser(user)) {
      this.users.push(user)
      this.touch()
    }
  }

  removeUser(userId: string) {
    const idx = this.users.findIndex((u: UserDto) => u.id === userId)
    if (idx > -1) {
      this.users.splice(idx, 1)
      this.touch()
    }
  }
}

/**
 * Minimal wrapper class for a paying member. It delegates
 * most state checks to the underlying `User` instance.
 */
export class MemberEntity implements MemberDto {
  user: UserDto

  constructor(user: UserDto) {
    this.user = user
  }

  /** Whether the user is currently an active paying member. */
  get isActive() {
    return this.user.status === 'member' || this.user.status === 'pro'
  }
}
