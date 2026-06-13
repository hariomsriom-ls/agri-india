import mongoose, {Schema} from "mongoose"
import { landRecord } from "../record/landrecord"
const landownerSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    address: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    mobileNumber: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true,'password is required']
    },
    image: {
        type: String,
        required: true
    },
    governmentid: {
        type: String,
        required: true
    },
    bankaccount: {
        type: Number,
        required: true
    },
    IFSCcode: {
        type: String,
          required: true
    },
    landID: [
        {
        type: Schema.Types.ObjectId,
        ref: "landRecord",
    }
],
    landarea: {
        type: Number,
        required: true
    },
    landdocuments: {
        type: String,
        required: true
    },
     landrentpayments: {
        type: Number,
        required: true
    },
    landleaseagreements: {
        type: String,
        required: true
    },
    cultivationPeriod:{
        type: Number,
        required: true
    },
    refreshToken: {
        type: String
    }
},{ timestamps: true })


export const landowner = mongoose.model("landowner", landownerSchema)