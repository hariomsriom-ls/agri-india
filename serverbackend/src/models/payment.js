import mongoose, {Schema} from "mongoose"

const paymentSchema = new Schema({
    bankaccount: { type: Number, required: true },
    paymentdate: { type: Date, required: true },
    transactionId: { type: String, required: true,trim: true },
    paymentMethod:{type: String,required: true },
    paymentStatus: { type: Boolean,required: true },
    paymentType: { type: String, required: true },
    PaymentTo: {type: Schema.Types.ObjectId, refPath: "PaymentToModel"},
    PaymentToModel: {type: String,enum: ["landowner", "worker", "organizationauthority"]},
    PaymentFrom: {type: Schema.Types.ObjectId, ref:"organizationauthority"}
},{timestamps: true})


export const Payment = mongoose.model("Payment", paymentSchema)