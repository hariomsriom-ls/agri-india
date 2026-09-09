import mongoose, {Schema} from "mongoose"

const complaintSchema = new Schema({
    _id: Number,
    message: {type: String,required: true},
    Date: {type: Date},
    category: {type: String, required: true},
    status: {type: String, enun: ["Pending", "Resolved", "Rejected"], required: true},
    complaintto: {type: Schema.Types.ObjectId, refPath: "NotificationToModel"},
    ComplaintToModel: {type: String,enum: ["landowner", "worker", "authority"]},
    complaintfrom: {type: Schema.Types.ObjectId, refPath: "NotificationFromModel"},
    ComplaintFromModel: {type: String,enum: ["landowner", "worker", "authority"]},
},
{timestamps: true}
)

export const Complaint = mongoose.model("Complaint",complaintSchema)