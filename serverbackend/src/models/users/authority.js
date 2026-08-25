import mongoose, {Schema} from "mongoose"
import { landRecord } from "../record/landrecord.js"
import { Address } from "../address/address.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authoritySchema = new Schema({
    authorityid:{
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    workingZone: {
        type: String,
        required: true,
    },
    Department: {
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
        default: 0
    },
    landleaseagreements: {
        type: String,
        default: "NONE"
    },
    landleasePeriod:{
        type: Number,
        default: 0
    },
    workersalaryPayments: {
        type: Number,
        default: 0
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

authoritySchema.pre("save", async function() {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

authoritySchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

authoritySchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        userName: this.userName,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
authoritySchema.methods.generateRefreshToken = function(){
     return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const organizationauthority = mongoose.model("authority", authoritySchema)