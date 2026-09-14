import mongoose, { Schema }from "mongoose";

const DistrictSchema = new mongoose.Schema({
     _id: Number,
 name: {type: String,required: true,trim:true},
  state: {
    type: Number,
    ref: "State",
    required: true,
  },
});
DistrictSchema.index({ state: 1, name: 1 }, { unique: true });
export const District = mongoose.model("District", DistrictSchema);