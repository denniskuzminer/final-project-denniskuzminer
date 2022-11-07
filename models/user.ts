import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  hash: String,
  favorites: [String],
  strategies: [mongoose.Schema.Types.ObjectId],
  backtests: [mongoose.Schema.Types.ObjectId],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
