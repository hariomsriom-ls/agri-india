import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import landownerValidations from "../../validations/landowner.validations.js";

const registerLandOwner = asyncHandler(async(req, res) => {
 
    /*  get user details
    validation - not empty
    check if user is registered already
    check for images if required
    upload them on cloudinary
    create user object
    create entry in db
    remove password and refresh token from response
    check for user creation
    return response*/

     const {fullName, mobileNumber, email, userName, password}= req.body
     console.log("email:", email);

     landownerValidations.fieldNotEmpty(req.body);
     landownerValidations.validateEmailId(req.body.email);
     landownerValidations.validateMobileNumber(req.body.mobileNumber);


    })

export { registerLandOwner }