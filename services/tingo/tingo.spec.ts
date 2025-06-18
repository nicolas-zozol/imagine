import { describe, expect, test, afterAll } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/* ------------------------------------------------------------------
   TingoDB ships only CommonJS, so we import it dynamically and
   annotate the minimal bits we use with `any` (still explicit!).
------------------------------------------------------------------- */
// @ts-ignore
const { default: createEngine } = (await import('tingodb')) as {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  default: () => {
    Db: new (
      path: string,
      opts: Record<string, unknown>,
    ) => {
      collection: (name: string) => any
    }
  }
}
const Engine = createEngine()

/* ------- helper types & promise-wrappers -------------------------------- */

interface HelloDoc {
  _id?: unknown // TingoDB adds the Mongo _id
  hello: string
  updated?: boolean
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type Collection = any // keep it simple – TingoDB has no typings
/* eslint-enable  @typescript-eslint/no-explicit-any */

const insertMany = <T>(
  col: Collection,
  docs: T[],
  opts: Record<string, unknown> = {},
): Promise<T[]> =>
  new Promise((resolve, reject) =>
    col.insert(docs, opts, (err: Error | null, res: T[]) =>
      err ? reject(err) : resolve(res),
    ),
  )

const findOne = <T>(
  col: Collection,
  query: Record<string, unknown>,
): Promise<T | null> =>
  new Promise((resolve, reject) =>
    col.findOne(query, (err: Error | null, doc: T | null) =>
      err ? reject(err) : resolve(doc),
    ),
  )

const updateOne = (
  col: Collection,
  query: Record<string, unknown>,
  update: Record<string, unknown>,
  opts: Record<string, unknown> = {},
): Promise<number> =>
  new Promise((resolve, reject) =>
    col.update(query, update, opts, (err: Error | null, modified: number) =>
      err ? reject(err) : resolve(modified),
    ),
  )

const removeMany = (
  col: Collection,
  query: Record<string, unknown>,
  opts: Record<string, unknown> = {},
): Promise<number> =>
  new Promise((resolve, reject) =>
    col.remove(query, opts, (err: Error | null, removed: number) =>
      err ? reject(err) : resolve(removed),
    ),
  )

/* ---------------------- test suite -------------------------------------- */

describe('TingoDB basic CRUD (strict TS)', () => {
  const dbPath: string = mkdtempSync(join(tmpdir(), 'tingo-'))
  const db = new Engine.Db(dbPath, {})
  const collection: Collection = db.collection(
    'batch_document_insert_collection_safe',
  )

  afterAll((): void => {
    rmSync(dbPath, { recursive: true, force: true })
  })

  test('insert two docs and fetch one of them', async () => {
    await insertMany<HelloDoc>(
      collection,
      [{ hello: 'world_safe1' }, { hello: 'world_safe2' }],
      { w: 1 },
    )

    const item = await findOne<HelloDoc>(collection, { hello: 'world_safe2' })
    expect(item).not.toBeNull()
    expect(item?.hello).toBe('world_safe2')
    console.log('>>>', item?._id)
  })

  test('update one doc in place', async () => {
    const modified = await updateOne(
      collection,
      { hello: 'world_safe1' },
      { $set: { updated: true } },
      { multi: false },
    )
    expect(modified).toBe(1)

    const item = await findOne<HelloDoc>(collection, { hello: 'world_safe1' })
    expect(item?.updated).toBe(true)
  })

  test('remove all docs', async () => {
    const removed = await removeMany(collection, {}, { justOne: false })
    expect(removed).toBeGreaterThanOrEqual(2)

    const stillThere = await findOne<HelloDoc>(collection, {})
    expect(stillThere).toBeNull()
  })
})
