import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/user";
import authReducer from "../features/auth";
import userPaymentReducer from "../features/landowner/paymenthistory"

export const store = configureStore({
  reducer: {
    user: userReducer, auth: authReducer, payment: userPaymentReducer,

  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;