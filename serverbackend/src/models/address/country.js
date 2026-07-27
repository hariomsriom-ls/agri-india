import mongoose, { Schema }from "mongoose";

const CountrySchema = new mongoose.Schema({

 _id: Number,
 name: {
    type: String,
    required: true,
    unique: true,
  },

}
);

export const Country = mongoose.model("Country", CountrySchema);