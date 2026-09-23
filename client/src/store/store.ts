import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/user";
import authReducer from "../features/auth";
import UserPaymentReducer from "../features/landowner-Worker-authority/paymenthistory"
import UserReviewReducer from "@/features/landowner-Worker-authority/reviewsdata";
import UserNotification from "@/features/landowner-Worker-authority/notificationdata";
import UserDocument from "@/features/landowner-Worker-authority/documentsdata";
import UserComplaint from "@/features/landowner-Worker-authority/complaintsdata";
import UserProject from "@/features/landowner-Worker-authority/projectsdata";
import UserLand from "@/features/landowner-Worker-authority/landsdata";
export const store = configureStore({
  reducer: {
    user: userReducer, auth: authReducer, payments: UserPaymentReducer, reviews: UserReviewReducer,
    notifications: UserNotification, documents: UserDocument, complaints: UserComplaint, projects: UserProject,
    lands: UserLand,

  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
