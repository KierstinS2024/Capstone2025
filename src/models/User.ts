import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  favorites: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  name: { type: String, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
