import mongoose, { Schema }from "mongoose";

const StateSchema = new mongoose.Schema({
     _id: Number,
 name: {type: String,required: true,unique: true,
  },});

export const State = mongoose.model("State", StateSchema);