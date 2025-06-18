import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'
import { User } from './domain.js'

let mongod: MongoMemoryServer
let client: MongoClient

beforeAll(async () => {
  // 1️⃣ start an in-memory mongod (wiredTiger in a tmp dir)
  mongod = await MongoMemoryServer.create()

  client = new MongoClient(mongod.getUri())
  await client.connect()

  // 2️⃣ seed from the fixture file
  const seedPath = path.join(__dirname, 'fixtures/fixtures-simple-1.json')
  const seed = JSON.parse(readFileSync(seedPath, 'utf8'))
  const db = client.db() // default "test" DB

  for (const [coll, docs] of Object.entries(seed)) {
    if (Array.isArray(docs) && docs.length) {
      await db.collection(coll).insertMany(docs as any[])
    }
  }
})

afterAll(async () => {
  await client.close() // closes driver
  await mongod.stop() // kills mongod *and deletes its tmp files*
})

describe('fixture demo', () => {
  it('reads a doc that came from seed.json', async () => {
    const users = client.db().collection<User>('users')
    const alice = await users.findOne({ _id: 'u1' })
    expect(alice?.email).toBe('alice@acme.io')
  })
})
