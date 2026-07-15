import allowedauthorites from "../../models/record/allowedauthoritesrecord";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError} from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import registrationValidations from "../../validations/registration.validations";


const addNewAuthority = asyncHandler(async(req,res)=> {
    const {email, phoneNumber, authorityId} = req.body;

       registrationValidations.fieldNotEmpty(req.body);
       registrationValidations.validateEmailId(req.body.email);
       registrationValidations.validateMobileNumber(req.body.phoneNumber);
    const existedUser = await allowedAuthorites.findOne({ $or: [{phoneNumber},{email},{authorityId}]  })
    if(existedUser){
         throw new ApiError(409, "record already exists")
     }
    const allowedAuthorites = await allowedauthorites.create({authorityId, email, phoneNumber})
     const createdallowedAuthorites = await allowedauthorites.findById(allowedAuthorites._id)
     if(!createdallowedAuthorites){
        throw new ApiError(500, "record not saved try again later")
     }

     return res.status(201).json( new ApiResponse(200, createdallowedAuthorites, "record registered successfully") )
    
})

const getallowedAuthoritesList = asyncHandler(async(req,res) =>{
     const allowedAuthorites = await allowedauthorites.find().sort({ createdAt: -1 });
     return res.status(200).json(new ApiResponse(200, allowedAuthorites, "list is provided successfully"))
})

const deleteAllowedAuthority = asyncHandler(async(req,res) => {
    const {email, phoneNumber, authorityId} = req.body;
       registrationValidations.fieldNotEmpty(req.body);
       registrationValidations.validateEmailId(req.body.email);
       registrationValidations.validateMobileNumber(req.body.phoneNumber);

    const existedAuthority = await allowedauthorites.findOne({ $or: [{phoneNumber},{email},{authorityId}]  })
    if(!existedAuthority){
         throw new ApiError(409, "record already deleted")
     }
    await allowedauthorites.findByIdAndDelete(authorityId)
    return res.status(200).json(new ApiResponse(200, {}, "the record is successfully deleted"))
})

export {
    addNewAuthority,
    getallowedAuthoritesList,
    deleteAllowedAuthority
}