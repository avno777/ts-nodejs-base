import { Schema, model, Document, ObjectId } from 'mongoose'

interface INotification extends Document {
  userId: ObjectId
  message: string
  createdAt: Date
  isRead: boolean
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }
  },
  { versionKey: false, timestamps: true }
)

const Notification = model<INotification>('Notification', NotificationSchema)
export default Notification
