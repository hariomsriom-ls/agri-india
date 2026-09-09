"use client"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/services";
import axios from "axios";

export type ComplaintStatus = "Pending" | "Resolved" | "Rejected";
export type ComplaintCategory = "Payment Issues" | "Document Issues" | "Management Issues" | "Technical Issues" | "Other Issues";

interface Complaint {
  _id: string;
  category: ComplaintCategory;
  message: string;
  date: string;
  status: ComplaintStatus;
}

interface UserComplaintState {
    data: Complaint[];
    status: "idle" | "loading" | "success" | "failed";
    error: string | null;
}

const initialState : UserComplaintState = {
    data: [],
    status: "idle",
    error: null,
};

type UserRole = "worker" | "landowner" | "authority";

export const fetchUserComplaint = createAsyncThunk<Complaint[],UserRole,{ rejectValue: string }>(
"Complaints/fetchComplaint",
async(role, {rejectWithValue}) => {
    try{
        const response = await api.get(`/${role}/get-complaints`, {withCredentials: true});
        const userComplaints: Complaint[] =response.data.data.ComplaintData ?? [];
        return[...userComplaints]
    }catch(error){
        if(axios.isAxiosError(error)){return rejectWithValue(error.response?.data?.message || "Failed to fetch complaints")}
        return rejectWithValue("unexpected Error occured")
    }
});

const UserComplaintSlice = createSlice({
    name:"Complaints",
    initialState,
    reducers: {
        setComplaints: (state,action:PayloadAction<Complaint[]>) => {state.data = action.payload;},
        updateComplaint: (state,action:PayloadAction<Partial<Complaint> & Pick<Complaint, "_id">>)=>{
            const index = state.data.findIndex((complaint)=>complaint._id === action.payload._id);
            if(index!==-1){
                state.data[index]={...state.data[index], ...action.payload};
            }
        },
        },
    extraReducers: (builder) => {
  builder
    .addCase(fetchUserComplaint.pending, (state) => {state.status = "loading";state.error = null;})
    .addCase(fetchUserComplaint.fulfilled, (state, action) => {state.status = "success";state.data = action.payload;})
    .addCase(fetchUserComplaint.rejected, (state, action) => {state.status = "failed";state.error = action.payload ?? "Failed to fetch notifications";})

},

    }
)
export const {setComplaints,updateComplaint} = UserComplaintSlice.actions

export default UserComplaintSlice.reducer;