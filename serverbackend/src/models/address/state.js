import mongoose, { Schema }from "mongoose";

const StateSchema = new mongoose.Schema({
     _id: Number,
 name: {type: String,required: true,unique: true,
  },
    country: {
    type: Number,
    ref: "Country",
    required: true,
  },
});
StateSchema.index({ country: 1, name: 1 }, { unique: true });
export const State = mongoose.model("State", StateSchema);