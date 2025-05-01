/**
 * Data structure easy to transfer and save.
 */
export type Serializable = Record<
  string,
  BaseSerializable | BaseSerializableArray
>

type BaseSerializable = string | number | boolean | undefined
type BaseSerializableArray = string[] | number[] | boolean[] | undefined[]
