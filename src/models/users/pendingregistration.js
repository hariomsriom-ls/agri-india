import mongoose, {Schema} from "mongoose";
import Jwt from "jsonwebtoken";

const pendingWorkerRegistrationSchema = new Schema({
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
    age: {
        type: Number,
        required: true
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
 },{timestamps: true})

  pendingWorkerRegistrationSchema.pre("save", async function(next) {
     if(!this.isModified("password")) return ;
     this.password = await bcrypt.hash(this.password,10)
 })
 
  pendingWorkerRegistrationSchema.methods.isPasswordCorrect = async function(password){
     return await bcrypt.compare(password, this.password)
 }

 export const pendingWorkerRegistration = mongoose.model("pendingWorkerRegistration", workerSchema)