import mongoose, {Schema} from "mongoose"
import { landRecord } from "../record/landrecord"
import Jwt from "jsonwebtoken";

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

 landownerSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
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