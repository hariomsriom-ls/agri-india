import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/user";
import authReducer from "../features/auth";
import UserPaymentReducer from "../features/landowner-Worker/paymenthistory"
import UserReviewReducer from "@/features/landowner-Worker/reviewsdata";
import UserNotification from "@/features/landowner-Worker/notificationdata";
import UserDocument from "@/features/landowner-Worker/documentsdata";
import UserComplaint from "@/features/landowner-Worker/complaintsdata";
export const store = configureStore({
  reducer: {
    user: userReducer, auth: authReducer, payments: UserPaymentReducer, reviews: UserReviewReducer,
    notifications: UserNotification, documents: UserDocument, complaints: UserComplaint,

  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;