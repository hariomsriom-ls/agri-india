import mongoose, {Schema} from "mongoose"


const reviewSchema = new Schema({
  // Worker IDs are strings; landowner and authority IDs are ObjectIds.
  ReviewFrom: {type: Schema.Types.Mixed, required: true, refPath: "ReviewfromModel"},
  ReviewfromModel: {type: String, required: true, enum: ["landowner", "worker", "authority", "organizationauthority"]},
  category: {type: String, required: true, enum: ["Platform Experience", "Support & Service", "Feature Request", "General Feedback"]},
  rating: {type: Number, required: true, min: 1, max: 5, validate: Number.isInteger},
  review: {type: String, required: true, trim: true, maxlength: 1000},
  suggestion: {type: String, trim: true, maxlength: 1000, default: ""},
  contact: {type: Boolean, default: false},
  status: {type: String,enum: ["PENDING", "Submitted"],default: "PENDING"},
},{timestamps: true})


export const Review = mongoose.model("Review", reviewSchema)
