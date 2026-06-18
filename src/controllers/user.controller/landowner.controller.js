import { asyncHandler } from "../../utils/asyncHandler.js";

const registerLandOwner = asyncHandler(async(req, res) => {
   res.status(200).json({
        message: "ok"
    })
})

export { registerLandOwner }