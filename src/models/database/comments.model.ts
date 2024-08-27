import { Schema, model, Document, ObjectId } from 'mongoose'

interface IComment extends Document {
  chapterId: ObjectId
  userId: ObjectId
  comment: string
  createdAt: Date
  replies: ObjectId[]
}

const CommentSchema = new Schema<IComment>(
  {
    chapterId: { type: Schema.Types.ObjectId, ref: 'UserChapter', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  },
  { versionKey: false, timestamps: true }
)

const Comment = model<IComment>('Comment', CommentSchema)
export default Comment
