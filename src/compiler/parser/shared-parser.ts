import { C, F } from '@masala/parser'

export const oneSpace = C.char(' ')
  .or(C.char('\t'))
  .or(C.char('\n'))
  .or(F.eos())
export const spaces = oneSpace.rep()

export const identifier = F.regex(/[a-zA-Z_][a-zA-Z0-9_-]*/).filter(
  (s) => s.charAt(s.length - 1) !== '-',
)
