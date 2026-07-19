import mongoose, {Schema} from "mongoose"

const allowedAuthoritesSchema = new Schema({
    authorityId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
},{timestaps: true})

const allowedauthorites = mongoose.model("allowedauthorites", allowedAuthoritesSchema);

export default allowedauthorites;
