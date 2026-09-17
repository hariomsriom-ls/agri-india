import mongoose, {Schema} from "mongoose"

const landRecordSchema = new Schema ({
    landStatus: {type: String, default: "Pending"},
    authorityAssigned: { type: Schema.Types.ObjectId, ref: "authority",},
    rentPeriod: {type: Number},
    equipmentAssigned: [{type: Schema.Types.ObjectId,ref: "equipment"}],
     landowner: {type: Schema.Types.ObjectId,ref: "landowner", required: "true"},
     materialUsed: [{type: String}],
     productOutput: {type: Number},
     productDetails: {type: Object,},
     landquality: {type: String, },
      landArea: {type: Number,required: true},
      landCity: {type: String,required: true},
      landLocation: {type: String,required: true},
      landDocuments: {type: String,required: true},
      landRentPayments: { type: Number,},
      landLeaseAgreements: {type: String, },
      cultivationPeriod:{type: Number, },

},{timestamps: true})


export const landRecord = mongoose.model("landRecord", landRecordSchema)