import { UserDto } from '../domain/domain.js'

import { Document, Model, model, Schema, Types } from 'mongoose'

// ----- Persistence-level document --------------------------
export interface MgUser
  extends Document, // brings in readonly id & other helpers
    Omit<UserDto, 'id'> {
  // avoid the collision
  _id: Types.ObjectId // explicit for clarity
}

/* Mongoose schema example */
const UserSchema = new Schema<MgUser>(
  {
    email: { type: String, required: true },
    image: String,
    memberCreated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    archivedAt: Date, // optional, for soft delete
    status: {
      type: String,
      enum: ['registered', 'member', 'pro', 'archived'],
      default: 'registered',
    },
  },
  { toJSON: { virtuals: true } }, // makes .id appear in JSON
)

// virtual id → string
UserSchema.virtual('id').get(function (this: MgUser) {
  return this._id.toHexString()
})

export const UserModel: Model<MgUser, {}, {}, {}, MgUser> = model<MgUser>(
  'User', // collection name will be `users` unless you override
  UserSchema,
  'users', // explicit collection name
)
