import mongoose, {Schema} from "mongoose"

const productionReportSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    productType:{
        type: String,
        required: true,
        lowercase: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    productionCost: {
        type: Number,
        required: true
    },
    productionSellStatus: {
        type: Boolean,
        required: true
    },
    productionSellPrice:{
        type: Number,
    },
    productOutcome:{
        type: Boolean
    },
    reason: String
},{timestamps: true})


export const payment = mongoose.model("productionReport", productionReportSchema)