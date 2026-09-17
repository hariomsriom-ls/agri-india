import mongoose, {Schema} from "mongoose";

const documentsSchema = new Schema({
   name: {type: String, required: true},
   category: {type: String, required: true},
   uploadDate: {type: String, required: true},
    fileUrl: {type: String,required: true},
    publicId: {type: String,},
    resourceType: String,
    format: String,
    // Worker IDs are strings; landowner and authority IDs are ObjectIds.
    documentOf: {type: Schema.Types.Mixed, refPath: "documentOfModel", required: true},
    documentOfModel: {type:  String, enum: ["landowner", "worker", "organizationauthority"]},
    documentFrom: {type: Schema.Types.Mixed, refPath: "documentFromModel",},
    documentFromModel: {type:  String, enum: ["landowner", "worker", "organizationauthority"]},


},{timestamps: true})

export const Documents = mongoose.model("Documents", documentsSchema)
