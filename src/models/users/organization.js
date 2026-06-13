import mongoose, {Schema} from "mongoose"
import { landRecord } from "../record/landrecord"

const organizationSchema = new Schema({
     authorityid:{
        type: Number,
        required: true
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
    contactNumber: {
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
    bankaccount: {
        type: Number,
        required: true
    },
    IFSCcode: {
        type: String,
          required: true
    },
     landpayments: {
        type: Number,
        required: true
    },
    landleaseagreements: {
        type: String,
        required: true
    },
    landleasePeriod:{
        type: Number,
        required: true
    },
    workersalaryPayments: {
        type: Number,
        required: true
    },
    projectAssigned: [
        {
            type: Schema.Types.ObjectId,
            ref: "project"
        }
    ],
    refreshToken: {
        type: String
    }
},{timestamps: true})

export const organization = mongoose.model("organization", organizationSchema)