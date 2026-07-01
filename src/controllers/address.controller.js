import { Address } from "../models/address.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createAddress = asyncHandler(async(req,res) => {
    const {addressType, houseNo, street, landmark, city, district, state, country, pincode, isDefault} =req.body;
    const newAddress = await Address.create({addressType, houseNo, street, landmark, city, district,
         state, country, pincode, isDefault})
    const createdAddress = await Address.findById(newAddress._id)

    return res.status(200).json(new ApiResponse(200, createdAddress, "address created successfully"))
})


export{
    createAddress

}