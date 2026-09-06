import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import api from "@/utils/services"; 
import axios from "axios";

export type PaymentStatus = "Paid" | "Pending" | "Failed";

export interface PaymentParty {
  _id: string;
  fullName: string;
}

export interface UserPayment {
  _id: string;
  amount: number;
  paymentType: string;
  paymentdate: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  bankaccount: number;
  PaymentTo?: string | PaymentParty[];
  PaymentFrom?: string | PaymentParty[];
  transactionId: string;
}

interface UserPaymentState {
  data: UserPayment[];
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
}

const initialState: UserPaymentState = {
  data: [],
  status: "idle",
  error: null,
};

export const fetchUserPayments = createAsyncThunk<
  UserPayment[],
  string,
  { rejectValue: string }
>(
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
      const receivedPayments: UserPayment[] = response.data.data.PaymentData ?? [];
      const paymentsSent: UserPayment[] = response.data.data.transactionData ?? [];

      return [...receivedPayments, ...paymentsSent];
    } catch (error) {if (axios.isAxiosError(error)) {return rejectWithValue(error.response?.data?.message || "Failed to fetch payments" );}
      return rejectWithValue("Unexpected error");
    } });


const userPaymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setPayment: (state, action: PayloadAction<UserPayment[]>) => {state.data = action.payload; },

    updateUserPayment: (state, action: PayloadAction<Partial<UserPayment> & {transactionId: string}>) => {
             const index = state.data.findIndex((payment)=>payment.transactionId === action.payload.transactionId);
             if(index!== -1){
              state.data[index] = {...state.data[index], ...action.payload};
             }
             },

    clearUserPayments: (state) => { state.data = []; state.status="idle"; state.error = null;},
   },
  extraReducers: (builder) => {builder
      .addCase(fetchUserPayments.pending, (state) => { state.status = "loading"; state.error = null;})
      .addCase(fetchUserPayments.fulfilled, (state, action) => {state.status = "success"; state.data = action.payload;})
      .addCase(fetchUserPayments.rejected, (state, action) => { state.status = "failed"; state.error = action.payload as string; });
  },
});


export const{  updateUserPayment, clearUserPayments, setPayment } = userPaymentSlice.actions;

export default userPaymentSlice.reducer;
