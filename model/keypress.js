import mongoose from "mongoose";

const keySchema = new mongoose.Schema({
  key: String,
  timeStamp: String,
  user: String,
  _workSpace: String,
  _fileType: String,
});

export const Keys = mongoose.model("key", keySchema);
