import mongoose from "mongoose";
const { Schema } = mongoose;

const BacktestSchema = new Schema({
  name: String,
  description: String,
  strategy: String,
  ranAt: Date,
  results: {
    startTime: Date,
    endTime: Date,
    totalPnL: Number,
    security: String,
    signals: [{ type: String, price: Number }],
  },
});

export default mongoose.models.Backtest ||
  mongoose.model("Backtest", BacktestSchema);
