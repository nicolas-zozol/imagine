import { Serializable } from '../utils/loggable.js'
import { Document, Types } from 'mongoose'

export function toDto<T extends Serializable>(
  obj: T,
  depth: number = 0,
  maxDepth: number = 10,
): T {
  if (depth > maxDepth) {
    throw new Error('Maximum recursion depth exceeded')
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === 'object' ? toDto(item, depth + 1, maxDepth) : item,
    ) as unknown as T
  }

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => key !== '_id' && typeof value !== 'function')
      .map(([key, value]) => [
        key,
        value && typeof value === 'object'
          ? toDto(value as unknown as Serializable, depth + 1, maxDepth)
          : value,
      ]),
  ) as T
}

/**
 * Convert a hydrated Mongoose document to a plain DTO:
 *   • keeps all virtuals                       (toObject({ virtuals:true }))
 *   • strips Mongo internals  _id / __v
 *   • adds  id: string          (hex copy of _id)
 *
 * The return-type is inferred from the schema automatically, so
 * nested paths, virtual getters, etc. stay fully typed.
 */
export function mgToDto<
  D extends Document & { _id: Types.ObjectId }, // accept any hydrated doc
>(
  doc: D,
): Omit<
  // R is the literal POJO type produced by doc.toObject()
  D extends { toObject(opts?: any): infer R } ? R : never,
  '_id' | '__v'
> & { id: string } {
  // materialise POJO with all virtuals in a single call
  const { _id, __v, ...rest } = doc.toObject({ virtuals: true }) as Record<
    string,
    any
  >

  // map _id → id and return
  return { ...rest, id: _id.toHexString() } as any
}
