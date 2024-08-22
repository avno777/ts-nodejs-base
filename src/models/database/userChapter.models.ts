import { Schema, model, Document, ObjectId } from 'mongoose'

interface IImage {
  url: string
  position: number
}

interface IVote {
  userId: ObjectId
  score: number
}

interface IUserChapter extends Document {
  originalBookId: ObjectId
  originalChapterNumber: number
  title: string
  authorId: ObjectId
  createdAt: Date
  wordCount: number
  tags: ObjectId[]
  content: string
  images: IImage[]
  votes: IVote[]
  comments: ObjectId[]
}

const ImageSchema = new Schema<IImage>({
  url: { type: String },
  position: { type: Number }
})

const VoteSchema = new Schema<IVote>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number }
})

const UserChapterSchema = new Schema<IUserChapter>({
  originalBookId: { type: Schema.Types.ObjectId, ref: 'OriginalBook', required: true },
  originalChapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  wordCount: { type: Number, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  content: { type: String, required: true },
  images: [ImageSchema],
  votes: [VoteSchema],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

const UserChapter = model<IUserChapter>('UserChapter', UserChapterSchema)
export default UserChapter
