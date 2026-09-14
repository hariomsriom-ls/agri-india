import mongoose, { Schema, SchemaType }from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    addressType: {type: String,enum: ["HOME", "OFFICE", "OTHER"],default: "HOME",},
    houseNo: { type: String, trim: true,},
    street: { type: String, trim: true,},
    landmark: { type: String,trim: true,},
    city: {type: String, required: true,trim: true,},
    district: { type: Number, ref: "District",required: true,trim: true,},
    state: {  type: Number, ref: "State", required: true, trim: true,},
    country: {  type: Number, ref: "Country", trim: true,},
    pincode: { type: String, required: true, trim: true,},
    isDefault: { type: Boolean, default: false,},
  },
  { timestamps: true }
);
export const Address = mongoose.model("Address", addressSchema);