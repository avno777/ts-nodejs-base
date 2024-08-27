import { Schema, model, Document, ObjectId } from 'mongoose'

interface IVote extends Document {
  userId: ObjectId
  chapterId: ObjectId
  star: number // 1 to 5 stars
}

const VoteSchema = new Schema<IVote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chapterId: { type: Schema.Types.ObjectId, ref: 'UserChapter', required: true },
    star: { type: Number, required: true, min: 1, max: 5 }
  },
  { versionKey: false, timestamps: true }
)

const Vote = model<IVote>('Vote', VoteSchema)
export default Vote
