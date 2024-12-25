import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    unique: true,
    lowercase: true,
  },
});

export const Users = mongoose.model("user", userSchema);
