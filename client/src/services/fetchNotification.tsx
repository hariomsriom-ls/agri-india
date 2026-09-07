"use client"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserNotification } from "@/features/landowner-Worker/notificationdata"; 

export function useFetchNotifications() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: notifications, status, error } = useAppSelector((state) => state.notifications,);

  useEffect(() => {
    if (role && status === "idle") {
      void dispatch(fetchUserNotification(role));
    }
  }, [dispatch, role, status]);

  return { role, notifications, status, error,
    hasnotifications: status === "success" && notifications.length > 0,
  };
}