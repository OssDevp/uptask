import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  email: string
  password: string
  name: string
  confirmed: boolean
}

const useShcema: Schema = new Schema({
  email: {
    type: String,
    require: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  confirmed: {
    type: Boolean,
    default: false
  }
})

const User = mongoose.model<IUser>('User', useShcema);
export default User;