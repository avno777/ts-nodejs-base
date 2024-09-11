import { Schema, model, Document, ObjectId } from 'mongoose'

export interface IAuthor extends Document {
  _id?: ObjectId
  name: string
  birthday: Date
  imageUrl: string
  description: string
}

const AuthorSchema = new Schema<IAuthor>({
  name: { type: String, required: true },
  birthday: { type: Date, require: true },
  imageUrl: { type: String },
  description: { type: String }
})

const Author = model<IAuthor>('Author', AuthorSchema)
export default Author
