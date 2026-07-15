import mongoose, {Schema} from "mongoose"

const projectSchema = new Schema({
    _id: String,
    projectLocation: {
        type: String,
        required: true
    },
    projectStartDate: {
         type: Date,
        required: true
    },
    projectDays: {
         type: Number,
        required: true
    },
    projectWorkers: [{
        type: Schema.Types.ObjectId,
        ref: "worker"
    } ],
    projectAuthority:{
        type: Schema.Types.ObjectId,
        ref: "organization"
    },
    projectLand: [{
        type: Schema.Types.ObjectId,
        ref: "landRecord"
    }],
    projectStatus:{
        type: String,
        required: true
    },
    projectOutput:{
        type: String,
        required: true
    }

},{timestamps: true})

export const project = mongoose.model("project", projectSchema)