import mongoose, {Schema} from "mongoose"

const equipmentSchema = new Schema({
    _id: String,
    equipmentName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    equipmentSize: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date
    },
    projectSentto: {
        type: Schema.Types.ObjectId,
        ref: "project"
    },
    returndate: {
        type: Date,
    },
    efficiency: {
        type: String
    }
},
{timestamps: true}
)

export const equipment = mongoose.model("equipment",equipmentSchema)