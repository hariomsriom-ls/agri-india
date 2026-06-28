import mongoose, {Schema} from "mongoose"
import { address} from "../address.js"
import { landRecord } from "../record/landrecord.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const landownerSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    address: [address],
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
    },
    governmentId: {
        type: String,
    },
    bankaccount: {
        type: Number,
    },
    IFSCcode: {
        type: String,
    },
    landID: [
        {
        type: Schema.Types.ObjectId,
        ref: "landRecord",
    }
],
    landArea: {
        type: Number,
    },
    landCity: {
        type: String,
    },
    landLocation: {
        type: String,
    },
    landDocuments: {
        type: String,
    },
    landRentPayments: {
        type: Number,
    },
    landLeaseAgreements: {
        type: String,
    },
    cultivationPeriod:{
        type: Number,
    },
    refreshToken: {
        type: String
    }
},{ timestamps: true })

 landownerSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password,10)
})

 landownerSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

 landownerSchema.methods.generateAccessToken = function(){
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
 landownerSchema.methods.generateRefreshToken = function(){
     return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const landowner = mongoose.model("landowner", landownerSchema)