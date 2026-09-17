import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import api from "@/utils/services"; 
import axios from "axios";
import { clearAuth, setAuth } from "@/features/auth";

export type PaymentRole = "worker" | "landowner" | "authority";

export type PaymentStatus = "Completed" | "Pending" | "Failed";

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
  role: PaymentRole | null;
  currentRequestId: string | null;
}

const initialState: UserPaymentState = {
  data: [],
  status: "idle",
  error: null,
  role: null,
  currentRequestId: null,
};

export const fetchUserPayments = createAsyncThunk<
  UserPayment[],
  PaymentRole,
  { rejectValue: string; state: { payments: UserPaymentState } }
>(
  "payment/fetchUserPayments",
  async (role, { rejectWithValue }) => {
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
      type ApiPayment = Omit<UserPayment, "paymentStatus"> & { paymentStatus: PaymentStatus | "Paid" };
      const receivedPayments: ApiPayment[] = response.data.data.PaymentData ?? [];
      const paymentsSent: ApiPayment[] = response.data.data.transactionData ?? [];

      // Salary/earnings pages show incoming payments, not money the user sent.
      const payments = role === "authority" ? [...receivedPayments, ...paymentsSent] : receivedPayments;
      return payments.map((payment): UserPayment => ({
        ...payment,
        paymentStatus: payment.paymentStatus === "Paid" ? "Completed" : payment.paymentStatus,
      })).sort((left, right) => new Date(right.paymentdate).getTime() - new Date(left.paymentdate).getTime());
    } catch (error) {if (axios.isAxiosError(error)) {return rejectWithValue(error.response?.data?.message || "Failed to fetch payments" );}
      return rejectWithValue("Unexpected error");
    } }, {
      condition: (role, { getState }) => {
        const state = getState().payments;
        return state.status !== "loading" || state.role !== role;
      },
    });


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

    clearUserPayments: () => initialState,
   },
  extraReducers: (builder) => {builder
      .addCase(clearAuth, () => initialState)
      .addCase(setAuth, () => initialState)
      .addCase(fetchUserPayments.pending, (state, action) => {
        if (state.role !== action.meta.arg) state.data = [];
        state.role = action.meta.arg;
        state.currentRequestId = action.meta.requestId;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserPayments.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.currentRequestId = null;
        state.status = "success";
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPayments.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.currentRequestId = null;
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch payments";
      });
  },
});


export const{  updateUserPayment, clearUserPayments, setPayment } = userPaymentSlice.actions;

export default userPaymentSlice.reducer;
