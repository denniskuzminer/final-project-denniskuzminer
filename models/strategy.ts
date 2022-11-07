import mongoose from "mongoose";
const { Schema } = mongoose;

const StrategySchema = new Schema({
  name: String,
  principal: Number,
  condition: String,
  actionIf: String,
  actionElse: String,
  on: String,
  per: String,
  startDate: Date,
  endDate: Date,
  options: String,
});

export default mongoose.models.Strategy ||
  mongoose.model("Strategy", StrategySchema);
