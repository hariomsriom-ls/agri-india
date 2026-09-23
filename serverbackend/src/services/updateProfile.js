import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {organizationauthority} from "../models/users/authority.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asynchandler.js"
import { Address } from "../models/address/address.js";
import { District } from "../models/address/district.js";
import { State } from "../models/address/state.js";
const userModels = {
  worker: worker,
  landowner: landowner,
  authority: organizationauthority,
};

const profileUpdateUser = asyncHandler(async(req, res) => {

     const User = req.user;
    const userId = User?._id;
    const role = User?.role || User?.constructor?.modelName;
    if(!User){
        throw new ApiError(400, "User not found in profileUpdateUser backend")
    }
    
    const model = userModels[role]
    if (!model) {
  throw new ApiError(400, "Invalid user role");
}
const updates = {};
if (role === "authority" && req.body.department !== undefined) {
  if (typeof req.body.department !== "string" || !req.body.department.trim()) {
    throw new ApiError(400, "Department is required");
  }
  updates.Department = req.body.department.trim();
}
   for (const field of [
  "fullName",
  "userName",
  "email",
  "bankaccount",
  "IFSCcode",
]) {
  if (req.body[field] !== undefined) {
    updates[field] = req.body[field];
  }
}if (req.body.contactNumber !== undefined) {
  const phoneField =
    role === "authority" ? "contactNumber" : "mobileNumber";

  updates[phoneField] = req.body.contactNumber;
}
const address = req.body.address;

if (address !== undefined) {
  if (
    !address ||
    ![address.city, address.district, address.state, address.pinCode]
      .every((value) => typeof value === "string" && value.trim())
  ) {
    throw new ApiError(400, "Complete all address fields");
  }

  const stateRecord = await State.findOne({ name: address.state.trim() });
  const districtRecord = stateRecord
    ? await District.findOne({ name: address.district.trim(), state: stateRecord._id })
    : null;

  if (!districtRecord || !stateRecord) {
    throw new ApiError(400, "District or state was not found");
  }

  const addressData = {
    city: address.city.trim(),
    district: districtRecord._id,
    state: stateRecord._id,
    pincode: address.pinCode.trim(),
  };

  const savedAddress = User.address
    ? await Address.findByIdAndUpdate(
        User.address,
        { $set: addressData },
        { new: true, runValidators: true }
      )
    : await Address.create(addressData);

  if (!savedAddress) {
    throw new ApiError(404, "Address not found");
  }

  updates.address = savedAddress._id;
}
const updateProfile = await model.findByIdAndUpdate(
  userId,
  { $set: updates },
  { new: true, runValidators: true }
)
  .select("-password -refreshToken")
  .populate({
    path: "address",
    populate: [
      { path: "district", select: "name" },
      { path: "state", select: "name" },
    ],
  });
  if (!updateProfile) {
  throw new ApiError(404, "User not found");
}
    return res.status(200).json(
        new ApiResponse(200, {userData: { ...updateProfile.toObject(), role }}, "details added successfully")
    )

})

export {profileUpdateUser}
