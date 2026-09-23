import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import api from "@/utils/services"; 
import axios from "axios";
 
interface Address {
  city: string;
  district: string;
  state: string;
  pinCode: string;
}

interface BaseUser {
  _id: string;
  fullName: string;
  email: string;
  address: Address;
  createdAt: Date;
  contactNumber: string;
  userName: string;
  bankaccount: string;
  IFSCcode: string;
  profileImage: string | null;
  governmentId: string | null; 
}

interface Worker extends BaseUser {
  role: "worker";
  workingZone: string;
  DOB: Date;
workerSalary: string;
workingTime:string;
bonus: string;
workingOn: string;
}

interface Landowner extends BaseUser {
  role: "landowner";
  landArea: number;
  landCity: string;
  landLocation: string;
  landDocuments: string;
  landRentPayments: number;
  landLeaseAgreements: string[];
  cultivationPeriod: number,
}

interface Authority extends BaseUser {
  role: "authority";
  authorityId: string;
  department: string;
   landpayments:number;
    landleaseagreements:string;
    landleasePeriod:number;
    workersalaryPayments: number;
    projectAssigned: string[];
}
 type User = Worker | Landowner | Authority;
interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
  imageUploading: boolean;
imageError: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
  imageUploading: false,
imageError: null,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (role: string, { rejectWithValue }) => {
    let apiCallUrl;
    if (role === "worker") {apiCallUrl = "/worker/get-user-details";}
   else if (role === "landowner") {apiCallUrl = "/landowner/get-user-details"; }
    else if (role === "authority") {apiCallUrl = "/authority/get-user-details"; }
     else {return rejectWithValue("Invalid user role");}
    try {
      const response = await api.get(apiCallUrl, {withCredentials: true,}); 
      const storedUser = response.data.data.userData; 
      return {
  ...storedUser,
  role,
  ...(role === "authority" ? { authorityId: storedUser.authorityid ?? "", department: storedUser.Department ?? "" } : {}),
  contactNumber: String(
    storedUser.mobileNumber ?? storedUser.contactNumber ?? ""
  ),
  profileImage: storedUser.image ?? null,
  address: {
    city: storedUser.address?.city ?? "",
    district: storedUser.address?.district?.name ?? "",
    state: storedUser.address?.state?.name ?? "",
    pinCode: storedUser.address?.pincode ?? "",
  },
};
    } catch (error) {if (axios.isAxiosError(error)) {return rejectWithValue(error.response?.data?.message || "Failed to fetch user" );}
      return rejectWithValue("Unexpected error");
    }
  }, {
      condition: (_, { getState }) => !(getState() as { user: UserState }).user.loading,
    });

 type UpdateUserArgs = {
  role: User["role"];
  updatedData: Partial<
    Pick<User, "fullName" | "userName" | "email" | "contactNumber" | "address">
  > & { department?: string };
}; 

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ role, updatedData }: UpdateUserArgs, { rejectWithValue }) => {
    let apiCallUrl;
    if (role === "worker") {apiCallUrl = "/worker/update-user-details";}
   else if (role === "landowner") {apiCallUrl = "/landowner/update-user-details"; }
    else if (role === "authority") {apiCallUrl = "/authority/update-user-details"; }
     else {return rejectWithValue("Invalid user role");}
    try {
      const response = await api.patch(apiCallUrl, updatedData, {withCredentials: true,}); 
      const storedUser = response.data.data.userData; 
     return { ...storedUser, role,
  ...(role === "authority" ? { authorityId: storedUser.authorityid ?? "", department: storedUser.Department ?? "" } : {}),
  contactNumber: String(storedUser.mobileNumber ?? storedUser.contactNumber ?? ""),
  profileImage: storedUser.image ?? null,
  address: {
    city: storedUser.address?.city ?? "",
    district: storedUser.address?.district?.name ?? "",
    state: storedUser.address?.state?.name ?? "",
    pinCode: storedUser.address?.pincode ?? "",
  },
};
    } catch (error) {if (axios.isAxiosError(error)) {return rejectWithValue(error.response?.data?.message || "Failed to update user" );}
      return rejectWithValue("Unexpected error");
    } });

    
    type UploadProfileImageArgs = {
  file: File;
  role: "worker" | "landowner" | "authority";
};

export const uploadProfileImage = createAsyncThunk< string, UploadProfileImageArgs, { rejectValue: string }>(
  "user/uploadProfileImage",
  async ({file, role},{ rejectWithValue }) => {
    if (!file.size) {
      return rejectWithValue("Choose a non-empty image");
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return rejectWithValue("Choose a JPG or PNG image");
    }

    if (file.size > 5 * 1024 * 1024) {
      return rejectWithValue("Image must be 5 MB or smaller");
    }

    const imageData = new FormData();
    imageData.append("image", file);
let apiUpdateUrl;
    if (role === "worker") {apiUpdateUrl = "/worker/profile-image";}
   else if (role === "landowner") {apiUpdateUrl = "/landowner/profile-image"; }
    else if (role === "authority") {apiUpdateUrl = "/authority/profile-image"; }
     else {return rejectWithValue("Invalid user role");}
    try {
      const response = await api.patch<{ data: { profileImage: string };}>(apiUpdateUrl, imageData, { withCredentials: true });

      return response.data.data.profileImage;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to upload profile image"
        );
      }

      return rejectWithValue("Unexpected error while uploading image");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {state.data = action.payload; },

    clearUser: (state) => { state.data = null;state.loading = false;state.error = null;state.imageUploading = false;state.imageError = null;},
   },
  extraReducers: (builder) => {builder
      .addCase(fetchUser.pending, (state) => { state.loading = true; state.error = null;})
      .addCase(fetchUser.fulfilled, (state, action) => {state.loading = false; state.data = action.payload;})
      .addCase(fetchUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
      builder
    .addCase(updateUser.pending, (state) => {state.loading = true;state.error = null;})
    .addCase(updateUser.fulfilled, (state, action) => {state.loading = false;state.error = null;state.data = action.payload;})
    .addCase(updateUser.rejected, (state, action) => {state.loading = false;state.error =typeof action.payload === "string"? action.payload: action.error.message ?? "Failed to update user";});
    builder
  .addCase(uploadProfileImage.pending, (state) => {state.imageUploading = true;state.imageError = null;})
  .addCase(uploadProfileImage.fulfilled, (state, action) => {state.imageUploading = false;state.imageError = null;
    if (state.data) {
      state.data.profileImage = action.payload;
    }
  })
  .addCase(uploadProfileImage.rejected, (state, action) => {state.imageUploading = false;state.imageError =  action.payload ??  action.error.message ??  "Failed to upload profile image";});
      
  },
});


export const{ clearUser, setUser } = userSlice.actions;

export default userSlice.reducer;
