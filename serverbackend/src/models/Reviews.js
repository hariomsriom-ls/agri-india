import mongoose, {Schema} from "mongoose"


const reviewSchema = new Schema({
ReviewFrom: {type: Schema.Types.ObjectId, refPath: "ReviewFromModel"},
ReviewfromModel: {type: String,enum: ["landowner", "worker", "organizationauthority"]},
  category: {type: String},
  rating: {type: Number,},
  title: {type: String, required: true},
  review: String,
  date: {type: Date, required: true},
  status: {type: String,enum: ["PENDING", "Submitted"],default: "PENDING"},
  responses: {type:Number, }
},{timestamps: true})


export const Review = mongoose.model("Review", reviewSchema)