/**
 * Data structure easy to transfer and save.
 */
export type Serializable = Record<
    string,
    BaseLoggable | BaseLoggableArray
>;

type BaseLoggable = string | number | boolean | undefined
type BaseLoggableArray = string[] | number[] | boolean[] | undefined[]