import mongoose, {Schema} from "mongoose"

const paymentSchema = new Schema({
    bankaccount: {
        type: Number,
        required: true
    },
    paymentdate: {
        type: Date,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        trim: true
    },
    paymentMethod:{
        type: String,
        required: true
    },
    paymentStatus: {
        type: Boolean,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    }
},{timestamps: true})


export const payment = mongoose.model("payment", paymentSchema)