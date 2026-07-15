import mongoose, {Schema} from "mongoose"

const projectChargeSchema = new Schema({
    equipmentUseCharge: {
        type: Number,
        required: true
    },
    transportationCharge: {
        type: Number,
        required: true
    },
    cultivationMaterialCharge: {
        type: Number,
        required: true
    },
    electricityCharge: {
        type: Number,
        required: true
    },
    workerCharge: {
        type: Number,
        required: true
    },
    landrent: {
        type: Number,
        required: true
    },
    authoritySalary: {
        type: Number,
        required: true
    },

},{timestamps: true})

export const projectCharge = mongoose.model("projectCharge", projectChargeSchema)