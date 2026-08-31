import { worker } from "../models/users/workers.js";
import { organizationauthority } from "../models/users/authority.js";
import { landowner } from "../models/users/landowner.js"; 
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";

const userLogin = async(login, password, role)=>{

    if(!login ){ throw new ApiError(400, `Username  required in ${role} login`)}
    if(!password){throw new ApiError(400, `password required in ${role} login`)}


if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {return {email : login};} 
else if (/^[6-9]\d{9}$/.test(login)) {return {mobilenumber : login};} 
else if (/^AGRIIN\d{4}$/.test(login)) {return {authorityid : login};}
else {return {username: login};}
}

const findUser = async(loginData, role, password) => {
const email = loginData.email;
const mobileNumber = loginData.mobilenumber;
const userName = loginData.username;
if(role === "worker"){
    const Worker = await worker.findOne({ $or: [{userName}, {email}, {mobileNumber}] })
            if(!Worker){ throw new ApiError(404, "worker not registered")}
    const isPasswordValid = await Worker.isPasswordCorrect(password)
            if(!isPasswordValid){throw new ApiError(401, "Invalid worker credentials")}
        return Worker;
            
}
else if(role === "authority"){
    const contactNumber = mobileNumber;
    const authorityId = loginData.authorityid;
    const organizationAuthority = await organizationauthority.findOne({ $or: [{userName}, {email}, {contactNumber}, {authorityId}]})
        if(!organizationAuthority){ throw new ApiError(404, "authority not registered")}   
    const isPasswordValid = await organizationAuthority.isPasswordCorrect(password)
        if(!isPasswordValid){ throw new ApiError(401, "Invalid organizationauthority credentials")}
     return organizationAuthority;
}
else if(role === "landowner"){
    const landOwner = await landowner.findOne({ $or: [{userName}, {email}, {mobileNumber}]})
        if(!landOwner){ throw new ApiError(404, "landowner not registered")}
    const isPasswordValid = await landOwner.isPasswordCorrect(password)
        if(!isPasswordValid){throw new ApiError(401, "Invalid landowner credentials")}
        return landOwner;
}
}

export {
    userLogin, findUser
}