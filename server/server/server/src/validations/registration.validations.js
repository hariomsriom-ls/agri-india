import { ApiError } from "../utils/ApiError.js"


const fieldNotEmpty = ({fullName, email, mobileNumber, userName, password}) => {
        if (
        [fullName, email, mobileNumber, userName, password].some((field) => !field || String(field).trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
}

const validateMobileNumber = (mobileNumber) => {
    if( !/^[6-9]\d{9}$/.test(mobileNumber) ){
        throw new ApiError(400, "Invalid Mobile Number")
    }
}

const validateEmailId = (email) => {
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        throw new ApiError(400, "Invalid Email Id")
    }
}



export default { fieldNotEmpty , validateMobileNumber, validateEmailId};