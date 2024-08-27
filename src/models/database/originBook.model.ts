import { Schema, model, Document, ObjectId } from 'mongoose'

interface IChapter {
  chapterNumber: number
  title: string
  content: string
  images: {
    url: string
    position: number
  }[]
}

interface IOriginalBook extends Document {
  title: string
  author: string
  chapters: IChapter[]
}

const ChapterSchema = new Schema<IChapter>({
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [
    {
      url: { type: String },
      position: { type: Number }
    }
  ]
})

const OriginalBookSchema = new Schema<IOriginalBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    chapters: [ChapterSchema]
  },
  { versionKey: false, timestamps: true }
)

const OriginalBook = model<IOriginalBook>('OriginalBook', OriginalBookSchema)
export default OriginalBook
