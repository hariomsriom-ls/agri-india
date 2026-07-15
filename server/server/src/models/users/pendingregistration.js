import mongoose, {Schema} from "mongoose";
import { Address } from "../address.js";
import Jwt from "jsonwebtoken";

const pendingWorkerRegistrationSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        },
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
        type: Date,
        required: true
    },
     status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    rejectionReason: {
        type: String,
        default: ""
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
 },{timestamps: true})

  pendingWorkerRegistrationSchema.pre("save", async function(next) {
     if(!this.isModified("password")) return ;
     this.password = await bcrypt.hash(this.password,10)
 })
 
  pendingWorkerRegistrationSchema.methods.isPasswordCorrect = async function(password){
     return await bcrypt.compare(password, this.password)
 }
 pendingWorkerRegistrationSchema.methods.generateAccessToken = function(){
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
pendingWorkerRegistrationSchema.methods.generateRefreshToken = function(){
      return jwt.sign({
         _id: this._id,
     },
         process.env.REFRESH_TOKEN_SECRET,
         {
             expiresIn:process.env.REFRESH_TOKEN_EXPIRY
         }
     )
 }

 export const pendingWorkerRegistration = mongoose.model("pendingWorkerRegistration", pendingWorkerRegistrationSchema)