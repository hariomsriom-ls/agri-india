import mongoose, {Schema} from "mongoose"

const notificationSchema = new Schema({
    _id: Number,
    title: { type: String, required: true,},
    message: {type: String,required: true},
    Date: {type: Date},
    unread: {type:boolean},
    notificationto: {type: Schema.Types.ObjectId, refPath: "NotificationToModel"},
    NotificationToModel: {type: String,enum: ["landowner", "worker", "organizationauthority"]},
    notificationfrom: {type: Schema.Types.ObjectId, refPath: "NotificationFromModel"},
    NotificationFromModel: {type: String,enum: ["landowner", "worker", "organizationauthority"]},
},
{timestamps: true}
)

export const Notification = mongoose.model("Notification",notificationSchema)

