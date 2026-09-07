import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/user";
import authReducer from "../features/auth";
import UserPaymentReducer from "../features/landowner-Worker/paymenthistory"
import UserReviewReducer from "@/features/landowner-Worker/reviewsdata";
import UserNotification from "@/features/landowner-Worker/notificationdata";
export const store = configureStore({
  reducer: {
    user: userReducer, auth: authReducer, payments: UserPaymentReducer, reviews: UserReviewReducer,
    notifications: UserNotification,

  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;