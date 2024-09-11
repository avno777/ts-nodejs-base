import { Schema, model, Document, ObjectId } from 'mongoose'

export interface IChapter {
  chapterNumber: string
  title: string
  content: string
  images: {
    url: string
    position: number
  }[]
}

export interface IOriginalBook extends Document {
  title: string
  author?: string
  imageCovers: string
  chapters: IChapter[]
  description: string
}

const ChapterSchema = new Schema<IChapter>({
  chapterNumber: { type: String, required: true },
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
    imageCovers: { type: String },
    chapters: [ChapterSchema],
    description: { type: String }
  },
  { versionKey: false, timestamps: true }
)

const OriginalBook = model<IOriginalBook>('OriginalBook', OriginalBookSchema)
export default OriginalBook
