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

}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (role: string, { rejectWithValue }) => {
    let apiCallUrl;
    if (role === "worker") {
      apiCallUrl = "/worker/get-user-details";
    } else if (role === "landowner") {
      apiCallUrl = "/landowner/get-user-details";
    } else if (role === "authority") {
      apiCallUrl = "/authority/get-user-details";
    } else {
      return rejectWithValue("Invalid user role");
    }
    try {
      const response = await api.get(apiCallUrl, {withCredentials: true,}); 
      const storedUser = response.data.data.userData; 
      return { ...storedUser,  contactNumber: storedUser.mobileNumber, };
    } catch (error) {if (axios.isAxiosError(error)) {return rejectWithValue(error.response?.data?.message || "Failed to fetch user" );}
      return rejectWithValue("Unexpected error");
    } });


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {state.data = action.payload; },

    updateUserData: (state, action: PayloadAction<Partial<User>>) => {
             if (state.data) { state.data = { ...state.data, ...action.payload,} as User; }
             },

    updateProfileImage: (state,action: PayloadAction<string> ) => {
        if (state.data) {state.data.profileImage = action.payload;}
        },

    clearUser: (state) => { state.data = null;state.loading = false;state.error = null;},
   },
  extraReducers: (builder) => {builder
      .addCase(fetchUser.pending, (state) => { state.loading = true; state.error = null;})
      .addCase(fetchUser.fulfilled, (state, action) => {state.loading = false; state.data = action.payload;})
      .addCase(fetchUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});


export const{  updateUserData, updateProfileImage, clearUser, setUser } = userSlice.actions;

export default userSlice.reducer;