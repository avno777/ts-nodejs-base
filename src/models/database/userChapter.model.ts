import { Schema, model, Document, ObjectId, Types } from 'mongoose'

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
  totalStars: Types.Decimal128
  totalVotes: number
  comments: ObjectId[]
  description: string
}

const ImageSchema = new Schema<IImage>({
  url: { type: String },
  position: { type: Number }
})

const VoteSchema = new Schema<IVote>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number }
})

const UserChapterSchema = new Schema<IUserChapter>(
  {
    originalBookId: { type: Schema.Types.ObjectId, ref: 'OriginalBook', required: true },
    originalChapterNumber: { type: Number, required: true },
    title: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    wordCount: { type: Number, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    content: { type: String, required: true },
    images: [ImageSchema],
    totalStars: { type: Schema.Types.Decimal128 },
    totalVotes: { type: Number },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    description: { type: String }
  },
  { versionKey: false, timestamps: true }
)

const UserChapter = model<IUserChapter>('UserChapter', UserChapterSchema)
export default UserChapter
