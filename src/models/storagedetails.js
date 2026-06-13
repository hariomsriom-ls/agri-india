import mongoose, {Schema} from "mongoose"

const storagedetailsSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    storageItemId: {
        type: String,
        required: true
    },
    storageItem:{
        type: String,
        required: true,
        lowercase: true
    },
    storageItemQuantity: {
        type: Number,
        required: true
    },
    storageCost: {
        type: Number,
        required: true
    },
    storageStatus: {
        type: String,
     required: true
    },
    storageLocation: {
        type: String,
     required: true
    },
    storageintialDate: {
        type: Date,
        required: true
    },
    maximumstorageDate:{
        type: Date,
        required: true
    },
    storageSpaceContactNumber: {
        type: Number,
        required: true
    }
},{timestamps: true})

export const storagedetails = mongoose.model("storagedetails", storagedetailsSchema)