import { Schema, model, Document, ObjectId } from 'mongoose'

interface IReadingList extends Document {
  userId: ObjectId
  listName: string
  chapters: ObjectId[]
}

const ReadingListSchema = new Schema<IReadingList>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  listName: { type: String, required: true },
  chapters: [{ type: Schema.Types.ObjectId, ref: 'UserChapter' }]
})

const ReadingList = model<IReadingList>('ReadingList', ReadingListSchema)
export default ReadingList
