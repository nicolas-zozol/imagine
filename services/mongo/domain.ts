/**
 * Minimal domain model shared by your app and tests.
 * Keep it tiny: only things you genuinely need today.
 */

export type Env = Record<string, string> // key–value env vars

export interface User {
  _id: string // keep string IDs
  email: string
  teamIds: string[] // membership (1-N)
  env?: Env // user-specific overrides
}

export interface Team {
  _id: string
  name: string
  userIds: string[] // denormalised for speed
  env?: Env // defaults for the team
}

export interface Store {
  _id: string // primary key
  teamId: string // owner team
  data: unknown // arbitrary JSON blob
}

/**
 * Handy helper: merge env layers ⇒ user overrides team
 */
export function resolveEnv(
  teamEnv: Env | undefined,
  userEnv: Env | undefined,
): Env {
  return { ...(teamEnv ?? {}), ...(userEnv ?? {}) }
}
