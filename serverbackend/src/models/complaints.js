import mongoose, {Schema} from "mongoose"

const complaintSchema = new Schema({
    _id: {type: Schema.Types.Mixed, default: () => new mongoose.Types.ObjectId()},
    message: {type: String,required: true, trim: true, maxlength: 1000},
    Date: {type: Date, default: Date.now},
    category: {type: String, required: true, enum: ["Payment Issues", "Document Issues", "Management Issues", "Technical Issues", "Other Issues"]},
    status: {type: String, enum: ["Pending", "Resolved", "Rejected"], default: "Pending", required: true},
    complaintto: {type: Schema.Types.Mixed, refPath: "ComplaintToModel"},
    ComplaintToModel: {type: String,enum: ["landowner", "worker", "authority"]},
    complaintfrom: {type: Schema.Types.Mixed, refPath: "ComplaintFromModel", required: true},
    ComplaintFromModel: {type: String,enum: ["landowner", "worker", "authority"]},
},
{timestamps: true}
)

export const Complaint = mongoose.model("Complaint",complaintSchema)
