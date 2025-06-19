/**
 * Serializable data containers: Env & Store
 * ---------------------------------------------------------
 *  • **Env**   – flat string‑only key/value store (serialises to a simple
 *                `Record<string, string>` that satisfies the project’s
 *                `Serializable` type alias).
 *  • **Store** – arbitrarily nested object/array container with dotted‑path
 *                accessors, ideal for workflow snapshots or execution data.
 *
 * ⚠️  Note: `Serializable` is now declared as a **type** (not an interface),
 *    so classes cannot `implements Serializable`. Instead, their `toJSON()`
 *    methods simply return data that *conforms* to that shape.
 */

// Import the type‑only alias for compile‑time checking.
import type { Serializable } from '../utils/loggable.js'

/* ------------------------------------------------------------------
 * Internal helpers
 * ----------------------------------------------------------------*/

/** Deep‑get utility that respects dotted paths like "profile.name.first" */
function deepGet(target: any, path: string): any {
  return path
    .split('.')
    .reduce((obj, key) => (obj == null ? undefined : obj[key]), target)
}

/** Deep‑set utility; creates nested objects/arrays as needed */
function deepSet(target: any, path: string, value: any): void {
  const keys = path.split('.')
  let obj = target
  keys.forEach((key, idx) => {
    if (idx === keys.length - 1) {
      obj[key] = value
    } else {
      if (obj[key] == null) obj[key] = {}
      obj = obj[key]
    }
  })
}

/* ------------------------------------------------------------------
 * Env – flat, string‑only key/value store
 * ----------------------------------------------------------------*/

export class Env {
  private readonly vars: Record<string, string>

  constructor(initial: Record<string, string> = {}) {
    this.vars = { ...initial }
  }

  /** Get a variable; undefined if absent */
  get(key: string): string | undefined {
    return this.vars[key]
  }

  /** Set or overwrite a variable; coerces everything to string */
  set(key: string, value: string | number | boolean | null | undefined): this {
    this.vars[key] = String(value)
    return this
  }

  /** Remove a key; returns true if it existed */
  delete(key: string): boolean {
    return delete this.vars[key]
  }

  /** Entries in `[key, value]` tuples */
  entries(): [string, string][] {
    return Object.entries(this.vars)
  }

  /**
   * Serialise to a shape compatible with the `Serializable` alias.
   * (Only primitive values at the top level.)
   */
  toJSON(): Serializable {
    return { ...this.vars }
  }
}

/* ------------------------------------------------------------------
 * Store – arbitrarily nested data container
 * ----------------------------------------------------------------*/

export class Store {
  private data: any

  constructor(initial: any = {}) {
    // Deep copy arrays/objects, leave primitives as‑is
    this.data = Array.isArray(initial) ? [...initial] : { ...initial }
  }

  /** Read nested value via dotted path. Pass empty path for root */
  get(path = ''): any {
    return path ? deepGet(this.data, path) : this.data
  }

  /**
   * Write to nested path, creating structure as needed. If path is empty,
   * the root object is replaced entirely.
   */
  set(path: string, value: any): this {
    if (!path) {
      this.data = value
    } else {
      deepSet(this.data, path, value)
    }
    return this
  }

  /** Delete a value at dotted path */
  delete(path: string): boolean {
    const keys = path.split('.')
    const last = keys.pop()!
    const parent = keys.length ? deepGet(this.data, keys.join('.')) : this.data
    if (parent && last in parent) {
      return delete parent[last]
    }
    return false
  }

  /** Serialise via structured clone */
  toJSON(): any {
    return JSON.parse(JSON.stringify(this.data))
  }
}

/* ------------------------------------------------------------------
 * Convenience factories
 * ----------------------------------------------------------------*/

export const createEnv = (pairs: Record<string, string> = {}): Env =>
  new Env(pairs)
export const createStore = (initial: any = {}): Store => new Store(initial)
