"use client"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/services";
import axios from "axios"

export type ReviewStatus = "Published" | "Under Review" | "Responded";
export type ReviewCategory = "Platform Experience" | "Support & Service" | "Feature Request" | "General Feedback";
export interface UserReview {
  _id: string;
  fullName: string;
}
export interface Reviews {
  _id: string;
  category: ReviewCategory;
  rating: number;
  title: string;
  review: string | UserReview[];
  date: string;
  status: ReviewStatus;
  responses: number;
}

interface UserReviewState {
    data: Reviews[];
    status: "idle" | "loading" | "success" | "failed";
    error: string | null;
    deletingReviewId: string | null;
}

const initialState : UserReviewState = {
    data: [],
    status: "idle",
    error: null,
    deletingReviewId: null,
};

type UserRole = "worker" | "landowner" | "authority";

export const fetchUserReview = createAsyncThunk<Reviews[],UserRole,{ rejectValue: string }>(
"Reviews/fetchReviews",
async(role, {rejectWithValue}) => {
    try{
        const response = await api.get(`/${role}/get-review-details`, {withCredentials: true});
        const userReviews: Reviews[] =response.data.data.ReviewData ?? [];
        return[...userReviews]
    }catch(error){
        if(axios.isAxiosError(error)){return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews")}
        return rejectWithValue("unexpected Error occured")
    }
});


export const deleteUserReview = createAsyncThunk<string,{ reviewId: string; role: UserRole },{ rejectValue: string }>(
  "Reviews/deleteReview",
  async ({ reviewId, role }, { rejectWithValue }) => {
    try {
      await api.delete(`/${role}/delete-review/${reviewId}`,{ withCredentials: true }
      );
      return reviewId;
    } catch (error) {
      if (axios.isAxiosError(error)) {return rejectWithValue(error.response?.data?.message ??"Failed to delete review");
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

const UserReviewSlice = createSlice({
    name:"Reviews",
    initialState,
    reducers: {
        setReview: (state,action:PayloadAction<Reviews[]>) => {state.data = action.payload;},
        clearReview: (state) =>{state.data = [], state.status ="idle"; state.error = null;},
        UpdateReview: (state,action:PayloadAction<Partial<Reviews>>)=>{
            const index = state.data.findIndex((review)=>review._id === action.payload._id);
            if(index!==-1){
                state.data[index]={...state.data[index], ...action.payload};
            }
        },
        DeleteReview: (state,action:PayloadAction<string>) =>{
            state.data = state.data.filter(
                (review)=> review._id !== action.payload
            ) 
            }
        },
    extraReducers: (builder) => {
  builder
    .addCase(fetchUserReview.pending, (state) => {state.status = "loading";state.error = null;})
    .addCase(fetchUserReview.fulfilled, (state, action) => {state.status = "success";state.data = action.payload;})
    .addCase(fetchUserReview.rejected, (state, action) => {state.status = "failed";state.error = action.payload ?? "Failed to fetch reviews";})

    .addCase(deleteUserReview.pending, (state, action) => {state.deletingReviewId = action.meta.arg.reviewId;state.error = null;})
    .addCase(deleteUserReview.fulfilled, (state, action) => {state.data = state.data.filter((review) => review._id !== action.payload);
        state.deletingReviewId = null; })
    .addCase(deleteUserReview.rejected, (state, action) => {state.deletingReviewId = null;state.error = action.payload ?? "Failed to delete review"; });
},

    }
)
export const {setReview,clearReview,UpdateReview, DeleteReview} = UserReviewSlice.actions

export default UserReviewSlice.reducer;