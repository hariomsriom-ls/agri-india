import mongoose, {Schema} from "mongoose";

const documentsSchema = new Schema({
   _id: String,
   name: {type: String, required: true},
   category: {type: String, required: true},
   uploadDate: {type: String, required: true},
    fileUrl: {type: String,required: true},
    publicId: {type: String,required: true},
    resourceType: String,
    format: String,
    documentOf: {type: Schema.Types.ObjectId, refPath: "documentOfModel", required: true},
    documentOfModel: {type:  String, enum: ["landowner", "worker", "organizationauthority"]},
    documentFrom: {type: Schema.Types.ObjectId, refPath: "documentOfModel", required: true},
    documentFromModel: {type:  String, enum: ["landowner", "worker", "organizationauthority"]},


},{timestamps: true})

export const Documents = mongoose.model("Documents", documentsSchema)
