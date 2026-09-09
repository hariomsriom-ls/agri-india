"use client"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/services";
import axios from "axios"

export type NotificationType = "Announcements" | "Land Updates" | "Payment Updates" | "Documents" | "System Alerts";
export type Filter = "All Notifications" | "Unread" | NotificationType;
export interface Notification {
  _id: string | number;
  title: string;
  message: string;
  time?: string;
  Date?: string;
  createdAt?: string;
  type?: NotificationType;
  unread: boolean;
  isNew?: boolean;
}

interface UserNotificationState {
    data: Notification[];
    status: "idle" | "loading" | "success" | "failed";
    error: string | null;
}

const initialState : UserNotificationState = {
    data: [],
    status: "idle",
    error: null,
};

type UserRole = "worker" | "landowner" | "authority";

export const fetchUserNotification = createAsyncThunk<Notification[],UserRole,{ rejectValue: string }>(
"Notifications/fetchNotifications",
async(role, {rejectWithValue}) => {
    try{
        const response = await api.get(`/${role}/get-notifications`, {withCredentials: true});
        const userNotifications: Notification[] =response.data.data.NotificationData ?? [];
        return[...userNotifications]
    }catch(error){
        if(axios.isAxiosError(error)){return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications")}
        return rejectWithValue("unexpected Error occured")
    }
});

const UserNotificationSlice = createSlice({
    name:"Notifications",
    initialState,
    reducers: {
        setNotifications: (state,action:PayloadAction<Notification[]>) => {state.data = action.payload;},
        clearNotifications: (state) =>{state.data = []; state.status ="idle"; state.error = null;},
        updateNotification: (state,action:PayloadAction<Partial<Notification> & Pick<Notification, "_id">>)=>{
            const index = state.data.findIndex((notification)=>notification._id === action.payload._id);
            if(index!==-1){
                state.data[index]={...state.data[index], ...action.payload};
            }
        },
        deleteNotification: (state,action:PayloadAction<Notification["_id"]>) =>{
            state.data = state.data.filter(
                (notification)=> notification._id !== action.payload
            )
            },
        markAllNotificationsRead: (state) => {
            state.data.forEach((notification) => { notification.unread = false; });
        },
        },
    extraReducers: (builder) => {
  builder
    .addCase(fetchUserNotification.pending, (state) => {state.status = "loading";state.error = null;})
    .addCase(fetchUserNotification.fulfilled, (state, action) => {state.status = "success";state.data = action.payload;})
    .addCase(fetchUserNotification.rejected, (state, action) => {state.status = "failed";state.error = action.payload ?? "Failed to fetch notifications";})

},

    }
)
export const {setNotifications,clearNotifications,updateNotification,deleteNotification} = UserNotificationSlice.actions

export default UserNotificationSlice.reducer;
