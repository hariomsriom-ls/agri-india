import mongoose, {Schema} from "mongoose"

const pendingregisterationSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
     image: {
        type: String,
        required: true
    },
    governmentid: {
        type: String,
        required: true
    },
    authorityid:{
        type: Number,
     },
      email: {
        type: String,
        lowercase: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
})

export const pendingregisteration = mongoose.model("pendingregisteration", pendingregisterationSchema)