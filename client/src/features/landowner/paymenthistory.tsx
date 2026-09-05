import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import api from "@/utils/services"; 
import axios from "axios";

interface Userpayments {
  paymentType: string;
  paymentdate: Date;
  paymentStatus: boolean;
  paymentMethod: string;
  bankaccount: string;
  paymentTo: string;
  paymentfrom: string;
  transactionId: string;
}

interface UserPaymentState {
  data: Userpayments | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
}

const initialState: UserPaymentState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchUserPayments = createAsyncThunk(
  "payment/fetchUserPayments",
  async (role: string, { rejectWithValue }) => {
    let apiCallUrl;
    if (role === "worker") {
      apiCallUrl = "/worker/get-payment-details";
    } else if (role === "landowner") {
      apiCallUrl = "/landowner/get-payment-details";
    } else if (role === "authority") {
      apiCallUrl = "/authority/get-payment-details";
    } else {
      return rejectWithValue("Invalid user role");
    }
    try {
      const response = await api.get(apiCallUrl, {withCredentials: true,}); 
      const UserIncome = response.data.paymentData; 
      const UserCharge = response.data.transactionData;
      return { ...UserIncome, ...UserCharge};
    } catch (error) {if (axios.isAxiosError(error)) {return rejectWithValue(error.response?.data?.message || "Failed to fetch payments" );}
      return rejectWithValue("Unexpected error");
    } });


const userPaymentSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPayment: (state, action: PayloadAction<Userpayments>) => {state.data = action.payload; },

    updateUserPayment: (state, action: PayloadAction<Partial<Userpayments>>) => {
             if (state.data) { state.data = { ...state.data, ...action.payload,} as Userpayments; }
             },

    clearUserPayments: (state) => { state.data = null;state.status="success";state.error = null;},
   },
  extraReducers: (builder) => {builder
      .addCase(fetchUserPayments.pending, (state) => { state.status = "loading"; state.error = null;})
      .addCase(fetchUserPayments.fulfilled, (state, action) => {state.status = "success"; state.data = action.payload;})
      .addCase(fetchUserPayments.rejected, (state, action) => { state.status = "failed"; state.error = action.payload as string; });
  },
});


export const{  updateUserPayment, clearUserPayments, setPayment } = userPaymentSlice.actions;

export default userPaymentSlice.reducer;