import mongoose, {Schema} from "mongoose";
import Jwt from "jsonwebtoken";

const workerSchema = new Schema({
    _id: String,
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    address: [address],
    workingZone: {
        type: String,
        required: true,
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
    DOB: {
        type: date,
        required: true
    },
     workerSalary: {
        type: Number,
        required: true
    },
    workingTime: {
        type: Number,
        required: true
    },
    bonus: {
        type: Number
    },
    workingOn: {
        type: Schema.Types.ObjectId,
        ref: "project",
    },
    refreshToken: {
        type: String
    },

},{timestamps: true})

workerSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
})

workerSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

workerSchema.methods.generateAccessToken = function(){
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
workerSchema.methods.generateRefreshToken = function(){
     return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const worker = mongoose.model("worker", workerSchema)