import mongoose, {Schema} from "mongoose"

const workerSchema = new Schema({
    _id: String,
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
     workersalary: {
        type: Number,
        required: true
    },
    workingtime: {
        type: Number,
        required: true
    },
    bonus: {
        type: Number
    },
    workingon: {
        type: Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    refreshToken: {
        type: String
    }
},{timestamps: true})

export const worker = mongoose.model("worker", workerSchema)