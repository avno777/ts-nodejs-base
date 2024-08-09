import { Document, model, Types, Schema } from 'mongoose'

export interface IUserChapter extends Document {
  _id?: string
  originalBookId?: Types.ObjectId
  originalChapterNumber?: number
  title?: string
  authorId?: Types.ObjectId
  createdAt?: Date
  wordCount?: number
  tags?: Types.ObjectId[]
  content?: string
  images?: [
    {
      url: string
      position: number
    }
  ]
  votes?: number
  comments?: Types.ObjectId[]
}

const userChapterSchema: Schema = new Schema({})
