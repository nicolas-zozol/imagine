import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, Collection, ObjectId } from 'mongodb'
import type { User, Team, Store, Env } from './domain.js'
import { resolveEnv } from './domain.js'

// ---------------------------------------------------------------------------
// Test-wide state
// ---------------------------------------------------------------------------
let mongod: MongoMemoryServer
let client: MongoClient

let users: Collection<User>
let teams: Collection<Team>
let stores: Collection<Store>

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()

  const db = client.db('unit')

  users = db.collection<User>('users')
  teams = db.collection<Team>('teams')
  stores = db.collection<Store>('stores')

  // email must be unique
  await users.createIndex({ email: 1 }, { unique: true })
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

/** reset collections before every spec for isolation */
beforeEach(async () => {
  await Promise.all([
    users.deleteMany({}),
    teams.deleteMany({}),
    stores.deleteMany({}),
  ])
})

// ---------------------------------------------------------------------------
// 20 illustrative tests
// ---------------------------------------------------------------------------
describe('Mongo playground for the trainee', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // BASIC CRUD
  // ──────────────────────────────────────────────────────────────────────────
  it('1️⃣ inserts a User document', async () => {
    const alice: User = { _id: 'u1', email: 'alice@acme.io', teamIds: [] }
    const { acknowledged } = await users.insertOne(alice)
    expect(acknowledged).toBe(true)

    const fromDb = await users.findOne({ _id: 'u1' })
    expect(fromDb).toEqual(alice)
  })

  it('2️⃣ finds a User by email', async () => {
    await users.insertOne({ _id: 'u2', email: 'bob@acme.io', teamIds: [] })
    const bob = await users.findOne({ email: 'bob@acme.io' })
    expect(bob?.email).toBe('bob@acme.io')
  })

  it('3️⃣ creates a Team and links a User to it', async () => {
    const team: Team = {
      _id: 't1',
      name: 'Dev',
      userIds: [],
      env: { TZ: 'UTC' },
    }
    await teams.insertOne(team)

    const user: User = { _id: 'u3', email: 'cara@acme.io', teamIds: ['t1'] }
    await users.insertOne(user)

    await teams.updateOne({ _id: 't1' }, { $push: { userIds: 'u3' } })

    const refreshedTeam = await teams.findOne({ _id: 't1' })
    expect(refreshedTeam?.userIds).toContain('u3')
  })

  it('4️⃣ prevents duplicate User emails (unique index)', async () => {
    await users.insertOne({ _id: 'u4', email: 'dup@acme.io', teamIds: [] })
    await expect(
      users.insertOne({ _id: 'u5', email: 'dup@acme.io', teamIds: [] }),
    ).rejects.toThrow() // E11000 duplicate key error
  })

  it('5️⃣ updates a User env var', async () => {
    await users.insertOne({
      _id: 'u6',
      email: 'env@acme.io',
      teamIds: [],
      env: { LANG: 'fr' },
    })
    await users.updateOne({ _id: 'u6' }, { $set: { 'env.LANG': 'en' } })

    const changed = await users.findOne({ _id: 'u6' })
    expect(changed?.env?.LANG).toBe('en')
  })

  it('6️⃣ deletes a User', async () => {
    await users.insertOne({ _id: 'u7', email: 'gone@acme.io', teamIds: [] })
    const { deletedCount } = await users.deleteOne({ _id: 'u7' })
    expect(deletedCount).toBe(1)
  })

  // ──────────────────────────────────────────────────────────────────────────
  // STORES
  // ──────────────────────────────────────────────────────────────────────────
  it('7️⃣ inserts a Store belonging to a Team', async () => {
    await teams.insertOne({ _id: 't2', name: 'Ops', userIds: [] })
    const s: Store = { _id: 's1', teamId: 't2', data: { key: 42 } }
    await stores.insertOne(s)

    const fromDb = await stores.findOne({ _id: 's1' })
    expect(fromDb?.teamId).toBe('t2')
  })

  it('8️⃣ updates Store JSON data', async () => {
    await stores.insertOne({ _id: 's2', teamId: 't2', data: { count: 1 } })
    await stores.updateOne({ _id: 's2' }, { $inc: { 'data.count': 4 } })

    const updated = await stores.findOne({ _id: 's2' })
    expect((updated?.data as any).count).toBe(5)
  })

  it('9️⃣ deletes a Store', async () => {
    await stores.insertOne({ _id: 's3', teamId: 't2', data: null })
    const { deletedCount } = await stores.deleteOne({ _id: 's3' })
    expect(deletedCount).toBe(1)
  })

  // ──────────────────────────────────────────────────────────────────────────
  // MULTI-DOC / AGGREGATION & “JOINS”
  // ──────────────────────────────────────────────────────────────────────────
  it('🔟 $lookup: Team → Users (one-to-many join)', async () => {
    await teams.insertOne({ _id: 't3', name: 'QA', userIds: ['u8'] })
    await users.insertOne({ _id: 'u8', email: 'qa@acme.io', teamIds: ['t3'] })

    const joined = await teams
      .aggregate([
        { $match: { _id: 't3' } },
        {
          $lookup: {
            from: 'users',
            localField: 'userIds',
            foreignField: '_id',
            as: 'members',
          },
        },
      ])
      .next()

    expect(joined?.members[0].email).toBe('qa@acme.io')
  })

  it('1️⃣1️⃣ counts Stores per Team with $group', async () => {
    await stores.insertMany([
      { _id: 's4', teamId: 't3', data: 1 },
      { _id: 's5', teamId: 't3', data: 2 },
      { _id: 's6', teamId: 't2', data: 3 },
    ])

    const rows = await stores
      .aggregate([
        { $group: { _id: '$teamId', total: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .toArray()

    expect(rows).toEqual([
      { _id: 't2', total: 1 },
      { _id: 't3', total: 2 },
    ])
  })

  it('1️⃣2️⃣ inlines a computed “effective env” (team ⊕ user)', async () => {
    await teams.insertOne({
      _id: 't4',
      name: 'Design',
      userIds: [],
      env: { THEME: 'dark', TZ: 'UTC' },
    })
    await users.insertOne({
      _id: 'u9',
      email: 'ux@acme.io',
      teamIds: ['t4'],
      env: { TZ: 'CET' },
    })

    const [team] = await teams.find({ _id: 't4' }).toArray()
    const [user] = await users.find({ _id: 'u9' }).toArray()

    const effective = resolveEnv(team.env, user.env)
    expect(effective).toEqual({ THEME: 'dark', TZ: 'CET' })
  })

  it('1️⃣3️⃣ upserts a Store (insert-or-update)', async () => {
    await stores.updateOne(
      { _id: 's100' },
      { $set: { teamId: 't2', data: { on: true } } },
      { upsert: true },
    )

    const justMade = await stores.findOne({ _id: 's100' })
    expect(justMade).not.toBeNull()

    // second run updates, not inserts
    await stores.updateOne(
      { _id: 's100' },
      { $set: { 'data.on': false } },
      { upsert: true },
    )
    const updated = await stores.findOne({ _id: 's100' })
    expect((updated!.data as any).on).toBe(false)
  })

  it('1️⃣4️⃣ pulls a User out of a Team array (membership removal)', async () => {
    await teams.insertOne({ _id: 't5', name: 'Docs', userIds: ['u10', 'u11'] })
    await users.insertOne({ _id: 'u10', email: 'a@acme.io', teamIds: ['t5'] })

    // remove user u10 from the team
    await teams.updateOne({ _id: 't5' }, { $pull: { userIds: 'u10' } })
    // and from user doc
    await users.updateOne({ _id: 'u10' }, { $pull: { teamIds: 't5' } })

    const team = await teams.findOne({ _id: 't5' })
    expect(team?.userIds).not.toContain('u10')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // EDGE-CASE / TYPE-SAFETY DEMOS
  // ──────────────────────────────────────────────────────────────────────────
  it('1️⃣5️⃣ projection returns partial doc', async () => {
    await users.insertOne({
      _id: 'u12',
      email: 'proj@acme.io',
      teamIds: [],
      env: { X: '1' },
    })
    const lite = await users.findOne<{ email: string }>(
      { _id: 'u12' },
      { projection: { email: 1 } },
    )
    expect(lite).toEqual({ _id: 'u12', email: 'proj@acme.io' })
  })

  it('1️⃣6️⃣ queries by nested env value', async () => {
    await users.insertMany([
      { _id: 'u13', email: 'env1@acme.io', teamIds: [], env: { LANG: 'fr' } },
      { _id: 'u14', email: 'env2@acme.io', teamIds: [], env: { LANG: 'en' } },
    ])
    const frenchies = await users.find({ 'env.LANG': 'fr' }).toArray()
    expect(frenchies.map((u) => u._id)).toEqual(['u13'])
  })

  it('1️⃣7️⃣ bulkWrite to add same env var to every Team', async () => {
    await teams.insertMany([
      { _id: 't6', name: 'EU', userIds: [], env: {} },
      { _id: 't7', name: 'US', userIds: [], env: {} },
    ])

    await teams.bulkWrite([
      {
        updateMany: { filter: {}, update: { $set: { 'env.VERSION': '1.0' } } },
      },
    ])

    const all = await teams.find({ 'env.VERSION': '1.0' }).toArray()
    expect(all.length).toBe(2)
  })

  // Skipping, need to configure a replica set for transactions
  it.skip('1️⃣8️⃣ runs a transaction (multi-doc atomicity)', async () => {
    const session = client.startSession()
    await session.withTransaction(async () => {
      await users.insertOne(
        { _id: 'u15', email: 'txn@acme.io', teamIds: [] },
        { session },
      )
      await teams.insertOne(
        { _id: 't8', name: 'Txn', userIds: ['u15'] },
        { session },
      )
    })
    await session.endSession()

    const ok = await users.findOne({ _id: 'u15' })
    expect(ok).not.toBeNull()
  })

  it('1️⃣9️⃣ aggregation pipeline parameterised with $match', async () => {
    await users.insertMany([
      { _id: 'u16', email: 'a@x.io', teamIds: [] },
      { _id: 'u17', email: 'b@y.io', teamIds: [] },
    ])

    const domain = 'x.io'
    const matched = await users
      .aggregate([
        { $match: { email: { $regex: `@${domain}$` } } },
        { $project: { email: 1 } },
      ])
      .toArray()

    expect(matched.length).toBe(1)
    expect(matched[0].email).toBe('a@x.io')
  })

  it('2️⃣0️⃣ compile-time safety: _id is a string', () => {
    // uncommenting the next line would give TS2322 again:
    // const bad: User = { _id: new ObjectId() as any, email: '', teamIds: [] };
    const good: User = { _id: 'safe', email: 'x', teamIds: [] }
    expect(good._id).toBeTypeOf('string')
  })
})
