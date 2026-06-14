import { asyncHandler } from "../../utils/asynchandler";

const registerLandOwner = asyncHandler(async(req, res) => {
    res.status(200).json({
        message: "ok"
    })
})

export { registerLandOwner }