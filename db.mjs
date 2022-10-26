import mongoose from "mongoose";
const { Schema } = mongoose;

export const userSchema = new Schema({
  username: String,
  hash: String,
  favorites: [String],
  strategies: [String],
  backtests: [mongoose.ObjectId],
});

export const indicatorSchema = new Schema({
  name: String,
  description: String,
  calculation: String,
});

export const backtestSchema = new Schema({
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
