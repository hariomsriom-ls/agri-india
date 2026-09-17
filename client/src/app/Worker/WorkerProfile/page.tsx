"use client";
import { useState, type ChangeEvent, useRef, useEffect } from "react";
import { ProfileCard,} from "@/components/cards/landowner/landowner-worker-profile"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {GoShieldLock, CiEdit} from "@/components/ui/icons";
import ProfileInput  from "@/components/ui/profileinput"
import { ReviewField } from "@/components/ui/ReviewField";
import Dropdown from "@/components/ui/Dropdown";
import { fetchUser, updateUser, uploadProfileImage } from "@/features/user";
import { useLocationDropdowns } from "@/hooks/useLocationDropdowns";

export default function WorkerProfile() {

 const { data: storedUser, loading, error, imageUploading, imageError } = useAppSelector((state) => state.user);
 const role = useAppSelector((state) => state.auth.role);
  const dispatch = useAppDispatch();
  const user = storedUser;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageSaved, setImageSaved] = useState(false);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const [isEditing1, setisEditing1] = useState(false);
  const [isEditing2, setisEditing2] = useState(false);
  const [isMainEditing, setisMainEditing] = useState(false)
 const [formData, setFormData] = useState<Record<string, string>>({});

   if (!role) return <p className="p-6 text-slate-600">Please sign in to view your profile.</p>;
  if (role !== "worker" || (user && user.role !== "worker")) {
    return <p role="alert" className="p-6 text-red-600">Only worker can view this profile.</p>;
  }
  if (!user) {
    if (error){
       return (
       <div className="p-6">
        <p role="alert" className="text-red-600">{error}</p>
        <button type="button" onClick={() => dispatch(fetchUser("landowner"))} className="mt-3 rounded-lg bg-green-700 px-4 py-2 text-white">Try again</button>
        </div>
       );
      }
    return <p role="status" className="p-6 text-slate-600">Loading your profile...</p>;
  }

   const locations = useLocationDropdowns({
     enabled: isEditing2 || isMainEditing,
     value: {
       country: formData.country,
       state: formData.state ?? user.address?.state ?? "",
       district: formData.district ?? user.address?.district ?? "",
     },
     onChange: (changes) => setFormData((previous) => ({ ...previous, ...changes })),
   });

useEffect(() => {
      if (role === "worker" && !storedUser && !loading && !error) {
        void dispatch(fetchUser("landowner"));
      }
    }, [dispatch, role, storedUser, loading, error]);

async function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file || imageUploading || storedUser?.role !== "landowner") return;
    setImageSaved(false);
    const result = await dispatch(uploadProfileImage({ file, role: "landowner" }));
    if (uploadProfileImage.fulfilled.match(result)) {
      setFailedImageUrl(null);
      setImageSaved(true);
    }
  }

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

function handleChangePassword(){

}

  return (
    <>
    <div className="min-h-full bg-[#f7f9f8] px-4 py-6 text-slate-800 sm:px-7">
      
          {/* Profile Header */}
          <section className="mb-6 flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-5">
               <div className="shrink-0 text-center">
              <input ref={imageInputRef} 
              type="file" accept="image/jpeg,image/png" 
              className="hidden"
              aria-label="Choose profile image" 
              disabled={imageUploading || loading} 
              onChange={handleProfileImageChange} />
               <button type="button" onClick={() => imageInputRef.current?.click()} disabled={imageUploading || loading}
                  aria-label="Upload profile image" aria-describedby="profile-image-help" aria-busy={imageUploading}
                  className="group relative h-24 w-24 overflow-hidden rounded-full border-2 border-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
                  {user.profileImage && user.profileImage !== failedImageUrl ? (
                
                    <img src={user.profileImage} alt={`${user.fullName}'s profile`}
                      onError={() => setFailedImageUrl(user.profileImage)} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-green-100 text-3xl font-semibold text-green-800">
                      {(user.fullName || user.userName || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-xs font-medium text-white">
                    {imageUploading ? "Uploading..." : "Change photo"}
                  </span>
                </button>
                <p id="profile-image-help" className="mt-1 text-xs text-slate-500">JPG or PNG, up to 5 MB</p>
                </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  @{user.userName}
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
          {imageError && <p role="alert" className="mb-4 text-sm text-red-600">{imageError}</p>}
          {imageSaved && !imageUploading && <p role="status" className="mb-4 text-sm text-green-700">Profile image updated successfully.</p>}

   {/* Information Grid */}
          <div className="grid grid-cols-2 gap-5">
            {/* Personal Information */}
           
            <> 
            <ProfileCard
              title="Personal Information"
              editable
              onEdit={() => setisEditing1(true)}
            >
            {isEditing1 || isMainEditing ? (<>
                <ProfileInput
              label="Username"
              name="userName"
              value={formData.userName ?? user.userName ?? ""}
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
              name="mobileNumber"
              value={formData.contactNumber ??user.contactNumber ?? ""}
              placeholder="Enter working zone"
              onChange={handleChange}
            />
            </>): (
              <>
              
              <ReviewField  label="Username" value={user.userName ?? ""} />
              <ReviewField label="Email" value={user.email ?? ""} />
              <ReviewField label="Mobile Number" value={user.contactNumber ?? ""} />
              <ReviewField label="Working Zone" value={user.workingZone ?? ""} />
              </>
            )}
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
              onEdit={()=> setisEditing2(true)}
            >
              {isEditing2 || isMainEditing? (
                <>
                <Dropdown {...locations.country} id="country" />
               <ProfileInput
              label="Village"
              name="village"
              value={formData.city ??user.address?.city ?? ""}
              placeholder="Enter city"
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

            </>): (
              <>
               <ReviewField label="Village" value={user.address?.city ?? ""} />
              <ReviewField  label="District" value={user.address?.district ?? ""}/>
              <ReviewField label="State" value={user.address?.state ?? ""}/>
              <ReviewField label="Pincode" value={user.address?.pinCode ?? ""}/>
                </>

            )}
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
            <ProfileCard 
            title="Role Information">
            
              <ReviewField label="Role" value={user.role} />
              <ReviewField label="Working ID" value={user._id} />
              <ReviewField label="Working Zone" value={user.workingZone} />
             
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
                <button
                onClick={handleChangePassword} 
                className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">
                  Change Password
                </button>
              }>
                <ReviewField label="Member Since" value={user.createdAt ?? ""}/>
                <ReviewField label="Mobile Number" value={user.contactNumber ?? ""} />
              <ReviewField label="Email" value={user.email ?? ""} />
              <ReviewField label="Password" value="••••••••••" />
               
            </ProfileCard>
            </>
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
    </>
  );
}