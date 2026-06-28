import mongoose, {Schema} from "mongoose"
import { landRecord } from "../record/landrecord"

const authoritySchema = new Schema({
     authorityid:{
        type: Number,
        required: true
     },
    address: [address],
    workingZone: {
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

authoritySchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
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

export const organizationAuthority = mongoose.model("authority", authoritySchema)