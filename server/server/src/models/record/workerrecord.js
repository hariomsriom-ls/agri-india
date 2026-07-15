import mongoose, {Schema} from "mongoose"

const workerRecordSchema = new Schema({
    workerid: {
        type: Schema.Types.ObjectId,
        ref: "worker"
    },
    workingtime: {
        type: Number,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    authorityAssigned: {
        type: Schema.Types.ObjectId,
        ref: "organization",
        required: true
    },
    workAssigned: {
        type: Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    efficiencyleve: {
        type: String,
        required: true
    }

},{timestamps: true})

export const workerRecord = mongoose.model("workerRecord", workerRecordSchema)