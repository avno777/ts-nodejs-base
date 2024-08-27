import { Schema, model, Document, ObjectId } from 'mongoose'

interface ITag extends Document {
  name: string
  createdBy: ObjectId
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { versionKey: false, timestamps: true }
)

const Tag = model<ITag>('Tag', TagSchema)
export default Tag
