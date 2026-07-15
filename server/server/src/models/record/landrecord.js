import mongoose, {Schema} from "mongoose"

const landRecordSchema = new Schema ({
    landareaUndertaken: {
        type: Number,
        required: true
    },
    cultivationStatus: {
        type: String,
        required: true
    },
    authorityAssigned: {
      type: Schema.Types.ObjectId,
      ref: "organization",
      required: true
    },
    rentPeriod: {
        type: Number
    },
    equipmentAssigned: [{
        type: Schema.Types.ObjectId,
        ref: "equipment"
}],
     landowner: {
        type: Schema.Types.ObjectId,
        ref: "landowner"
     },
     materialUsed: [{
        type: String,
        required: true
     }],
     productOutput: {
        type: Number
     },
     productDetails: {
        type: Object,
     },
     rentdetails: {
        type: Object
     },
     landquality: {
        type: String,
        required: true
     }

},{timestamps: true})


export const landRecord = mongoose.model("landRecord", landRecordSchema)