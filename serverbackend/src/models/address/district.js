import mongoose, { Schema }from "mongoose";

const DistrictSchema = new mongoose.Schema({
     _id: Number,
 name: {type: String,required: true,unique: true},
});

export const District = mongoose.model("District", DistrictSchema);