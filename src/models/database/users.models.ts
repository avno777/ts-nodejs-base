import { Schema, Document, Types, model } from 'mongoose'

export interface IUser extends Document {
  _id?: string
  fullname: string
  displayName: string
  email: string
  googleId?: string
  password?: string
  avatarUrl?: string
  role: 'User' | 'Admin ' | 'SuperAdmin'
  refreshToken?: [string]
  phone?: string
  isAdmin?: boolean
  isActive?: boolean
  isDeleted?: boolean
  followers?: Types.ObjectId[]
  following?: Types.ObjectId[]
  readingHistory?: Types.ObjectId[]
  readingLists?: Types.ObjectId[]
  otp?: number
  otpTime?: Date
}

const userSchema: Schema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    displayName: {
      type: String,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true
    },
    googleId: { type: String },
    avatarUrl: { type: String },
    password: {
      type: String
    },
    role: {
      type: String,
      enum: ['User', 'Admin', 'SuperAdmin'],
      default: 'User'
    },
    phone: {
      type: String
    },
    refreshToken: {
      type: [String],
      select: false
    },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    followers: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
    readingHistory: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
    readingLists: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],

    otp: { type: String, length: 6, select: false },
    otpTime: Date
  },
  { versionKey: false, timestamps: true }
)

const UserModel = model<IUser>('UserModel', userSchema)
export default UserModel
