import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    google_id: { type: String },
    phone: { type: String },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    user_photo: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

export default User;
