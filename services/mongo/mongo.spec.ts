import { MongoClient, Collection } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { beforeAll, afterAll, describe, it, expect } from 'vitest'

// ----- declare the shape of a “user” document -----
interface User {
  _id: string // <-- string not ObjectId
  name: string
  age?: number
}

let mongod: MongoMemoryServer
let client: MongoClient
let users: Collection<User>

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()

  // pass the Interface to `collection<>()`
  users = client.db('testdb').collection<User>('users')
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

describe('users collection (string _id)', () => {
  it('inserts and fetches a user', async () => {
    const ada: User = { _id: 'u1', name: 'Ada', age: 28 }
    await users.insertOne(ada)

    const fromDb = await users.findOne({ _id: 'u1' })
    expect(fromDb).toEqual(ada)
  })
})
