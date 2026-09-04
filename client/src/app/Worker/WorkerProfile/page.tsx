"use client";

import { ProfileCard, EditableField } from "@/components/cards/landowner/landowner-profile"
import {ReviewField} from "@/components/ui/ReviewField";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {GoShieldLock, CiEdit} from "@/components/ui/icons";



export default function LandownerProfile() {

 const storedUser = useAppSelector((state) => state.user.data);

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
 // if(!user) {return <p>User data not found in LandownerProfile page line no 10</p>;}
  if(user.role !== "landowner") {return <p>User is not a landowner in LandownerProfile page line no 12</p>;}
  return (
    <>
    <div className="min-h-full bg-[#f7f9f8] px-4 py-6 text-slate-800 sm:px-7">
        {/* Topbar */}
        <header className="flex h-20 items-center justify-between border-b bg-white px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>

          <div className="flex items-center gap-3">
            <img
              src="/images/profile.jpg"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-medium text-gray-900">
                {user.fullName}
              </p>

              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        </header>
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
              onClick={() => console.log("Edit profile")}
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
            >
              <ReviewField
                label="Full Name"
                value={user.fullName}
              />

              <ReviewField
                label="Username"
                value={user.userName}
              />

              <ReviewField
                label="Email"
                value={user.email}
              />

              <ReviewField
                label="Mobile Number"
                value={user.contactNumber}
              />

            </ProfileCard>

            {/* Address */}
            <ProfileCard
              title="Address Information"
              editable
            >
              <ReviewField
                label="Village"
                value={user.address?.city || "NA"}
              />

              <ReviewField
                label="District"
                value={user.address?.district || "NA"}
              />

              <ReviewField
                label="State"
                value={user.address?.state || "NA"}
                 />

              <ReviewField
                label="PIN Code"
                value={user.address?.pinCode || "NA"}
              />
            </ProfileCard>

            {/* Role Information */}
            <ProfileCard title="Role Information">
              <ReviewField
                label="Role"
                value={user.role}
              />

              <ReviewField
                label="Landowner ID"
                value={user._id}
              />

              <ReviewField
                label="Total Land Area"
                value={user.landArea}
              />

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
                <ReviewField
                label="Member Since"
                value={user.createdAt}
              />

              <EditableField
                label="Email"
                value={user.email}
              />

              <EditableField
                label="Mobile Number"
                value={user.contactNumber}
              />

              <EditableField
                label="Password"
                value="••••••••••"
              />
            </ProfileCard>
            </div>
          </div>
          </div>
    </>
  );
}