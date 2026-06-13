import mongoose, {Schema} from "mongoose"

const transportationdetailsSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    transportationpartnerId: {
        type: String,
        required: true
    },
    transportationVeichle:{
        type: String,
        required: true,
        lowercase: true
    },
    transportationItem:{
        type: String,
        required: true,
        lowercase: true
    },
    transportationCost: {
        type: Number,
        required: true
    },
    transportationStatus: {
        type: String,
     required: true
    },
    transportationStartLocation: {
        type: String,
     required: true
    },
    transportationStartDate: {
        type: Date,
        required: true
    },
    transportationreachingDate:{
        type: Date,
        required: true
    },
    transportationFinalLocation: {
        type: String,
     required: true
    }
    
},{timestamps: true})

export const transportationdetails = mongoose.model("transportationdetails", transportationdetailsSchema)