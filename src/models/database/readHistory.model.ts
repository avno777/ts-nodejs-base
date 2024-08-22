import { Schema, model, Document, ObjectId } from 'mongoose'

interface IReadHistory extends Document {
  userId: ObjectId
  chapterId: ObjectId
  progress: number
  lastReadAt: Date
}

const ReadHistorySchema = new Schema<IReadHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  chapterId: { type: Schema.Types.ObjectId, ref: 'UserChapter', required: true },
  progress: { type: Number, required: true },
  lastReadAt: { type: Date, default: Date.now }
})

const ReadHistory = model<IReadHistory>('ReadHistory', ReadHistorySchema)
export default ReadHistory
