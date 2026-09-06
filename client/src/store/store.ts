import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/user";
import authReducer from "../features/auth";
import userPaymentReducer from "../features/landowner-Worker/paymenthistory"
import UserReviewReducer from "@/features/landowner-Worker/reviewsdata";

export const store = configureStore({
  reducer: {
    user: userReducer, auth: authReducer, payments: userPaymentReducer, reviews: UserReviewReducer,
    

  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;