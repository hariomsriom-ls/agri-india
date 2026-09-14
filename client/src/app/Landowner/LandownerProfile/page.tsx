"use client";
import { useState, type ChangeEvent } from "react";
import { ProfileCard } from "@/components/cards/landowner/landowner-worker-profile"
import {ReviewField} from "@/components/ui/ReviewField";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {GoShieldLock, CiEdit} from "@/components/ui/icons";
import ProfileInput from "@/components/ui/profileinput";
import Dropdown from "@/components/ui/Dropdown";
import { updateUser } from "@/features/user";
import { useLocationDropdowns } from "@/hooks/useLocationDropdowns";

export default function LandownerProfile() {

 const storedUser = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const user = storedUser ??{
    _id: "1234567890",
    fullName: "John Doe",
    userName: "johndoe",
    email: "johndoe@example.com"
  , contactNumber: "1234567890", 
address: {
  city: "Sample City",
  district: "Sample District",
  state: "Sample State",
  pinCode: "123456"
},
  role: "landowner",
  landArea: "10 acres",
  createdAt: "2022-01-01",
    landId: "LAND123456",
  };
   if(!user) {return <p>User data not found in LandownerProfile page line no 32</p>;}
  if(user.role !== "landowner") {return <p>User is not a landowner in LandownerProfile page line no 33</p>;}
    const [isEditing1, setisEditing1] = useState(false);
    const [isEditing2, setisEditing2] = useState(false);
    const [isMainEditing, setisMainEditing] = useState(false)
   const [formData, setFormData] = useState<Record<string, string>>({});
   const locations = useLocationDropdowns({
     enabled: isEditing2 || isMainEditing,
     value: {
       country: formData.country,
       state: formData.state ?? user.address?.state ?? "",
       district: formData.district ?? user.address?.district ?? "",
     },
     onChange: (changes) => setFormData((previous) => ({ ...previous, ...changes })),
   });

  

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    setFormData((previous) => ({...previous,[name]: value, }));
  }
  
  async function handleSave(){
    if (!storedUser) {alert("Please log in to save your profile."); 
      return;
    }
    const addressChanged = ["city", "district", "state", "pinCode"].some((field) => formData[field] !== undefined);
const updatedData = {
  fullName: formData.fullName ?? storedUser.fullName,
  userName: formData.userName ?? storedUser.userName,
  email: formData.email ?? storedUser.email,
  contactNumber: formData.contactNumber ?? storedUser.contactNumber,

  ...(addressChanged
    ? {
        address: {
          city: formData.city ?? storedUser.address?.city ?? "",
          district:formData.district ?? storedUser.address?.district ?? "",
          state: formData.state ?? storedUser.address?.state ?? "",
          pinCode:formData.pinCode ?? storedUser.address?.pinCode ?? "",
        },
      }
    : {}),
};
  
    try {
    await dispatch(
      updateUser({
        role: storedUser.role,
        updatedData,
      })
    ).unwrap();
      setFormData({});
      setisEditing1(false);
      setisEditing2(false);
      setisMainEditing(false);
        } catch (error) {
    alert( typeof error === "string"? error: "Failed to save your profile. Please try again.");
  }
}
 
  return (
    <>
    <div className="min-h-full bg-[#f7f9f8] px-4 py-6 text-slate-800 sm:px-7">
         <div className="p-7">
          {/* Profile Header */}
          <section className="mb-6 flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <img
                src="/images/profile.jpg"
                alt="profile"
                className="h-24 w-24 rounded-full object-cover"
              />

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {user.userName}
                </p>

                <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {user.role}
                </span>

                <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                  <GoShieldLock
                    size={17}
                    className="text-green-600"
                  />

                  Verified Account
                </div>
                 </div>
            </div>

            <button
              onClick={() => setisMainEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
            >
              <CiEdit size={17} />
              Edit Profile
            </button>
          </section>

   {/* Information Grid */}
          <div className="grid grid-cols-2 gap-5">
            {/* Personal Information */}
            <ProfileCard
              title="Personal Information"
              editable
              onEdit={()=>setisEditing1(true)}
            >
              {isEditing1 || isMainEditing ? (
                <>
                <ProfileInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName ??user.fullName?? ""}
                    placeholder="Enter working zone"
                    onChange={handleChange}
                  />

                  <ProfileInput
                    label="Username"
                    name="userName"
                    value={formData.userName ??user.userName?? ""}
                    placeholder="Enter working zone"
                    onChange={handleChange}
                  />

                  <ProfileInput
                    label="Email"
                    name="email"
                    value={formData.email ??user.email?? ""}
                    placeholder="Enter working zone"
                    onChange={handleChange}
                  />

                  <ProfileInput
                    label="Mobile Number"
                    name="contactNumber"
                    value={formData.contactNumber ??user.contactNumber?? ""}
                    placeholder="Enter working zone"
                    onChange={handleChange}
                  />
                
                </>
              ):(<>
              <ReviewField  label="Full Name" value={user.fullName} />
              <ReviewField  label="Username" value={user.userName} />
              <ReviewField label="Email" value={user.email} />
              <ReviewField  label="Mobile Number"  value={user.contactNumber} />
                </>
                )
              }
              {isEditing1 ? (
                <div className = "flex w-full justify-end py-3">
                <button 
                onClick ={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm 
                font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                disabled:opacity-50">
                  Save
                </button>
                </div>
              ): ("")
              }
            </ProfileCard>

            {/* Address */}
            <ProfileCard
              title="Address Information"
              editable
              onEdit={() => setisEditing2(true)}
      >
        {isEditing2 || isMainEditing ? (
          <>
                <Dropdown {...locations.country} id="country" />
                <ProfileInput
                    label="Village"
                    name="city"
                    value={formData.city ??user.address?.city?? ""}
                    placeholder="Enter working zone"
                    onChange={handleChange}
                  />

                <Dropdown {...locations.state} id="state" />
                <Dropdown {...locations.district} id="district" />
    
                  <ProfileInput
                  label="Pincode"
                  name="pinCode"
                  value={formData.pinCode ??user.address?.pinCode ?? ""}
                  placeholder="Enter working zone"
                  onChange={handleChange}
                />
                </>
              ):(<>
              <ReviewField  label="Village"  value={user.address?.city || "NA"}/>
              <ReviewField  label="District"  value={user.address?.district || "NA"}/>
              <ReviewField  label="State"  value={user.address?.state || "NA"}/>
              <ReviewField  label="PIN Code"  value={user.address?.pinCode || "NA"}/>
              </>)}
              {isEditing2 ? (
               <div className = "flex w-full justify-end py-3">
                <button 
                onClick ={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm 
                font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                disabled:opacity-50">
                  Save
                </button>
                </div>
              ): ("")
              }
            </ProfileCard>

            {/* Role Information */}
            <ProfileCard title="Role Information">
              <ReviewField  label="Role" value={user.role} />
              <ReviewField  label="Landowner ID" value={user._id}/>
              <ReviewField label="Total Land Area" value={user.landArea}/>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">
                  Verification Status
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Verified
                </span>
              </div>
            </ProfileCard>

            {/* Security */}
            <ProfileCard
              title="Account & Security"
              button={
                <button className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">
                  Change Password
                </button>
              }>
                <ReviewField label="Member Since"  value={user.createdAt} />
              <ReviewField  label="Email"  value={user.email}/>
              <ReviewField  label="Mobile Number"  value={user.contactNumber}/>
              <ReviewField  label="Password"  value="••••••••••"/>
            </ProfileCard>
            {isMainEditing ? (
                <div className = "flex w-full justify-end py-3">
                <button 
                onClick ={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm 
                font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                disabled:opacity-50">
                  Save
                </button>
                </div>
              ): ("")
              }
            </div>
          </div>
          </div>
    </>
  );
}
