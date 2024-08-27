import { Schema, model, Document, ObjectId } from 'mongoose'

interface IFollower extends Document {
  userId: ObjectId
  followerId: ObjectId
}

const FollowerSchema = new Schema<IFollower>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { versionKey: false, timestamps: true }
)

const Follower = model<IFollower>('Follower', FollowerSchema)
export default Follower
