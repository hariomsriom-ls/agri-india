"use client"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserComplaint, type UserRole } from "@/features/landowner-Worker/complaintsdata"

export function useFetchComplaint(requiredRole?: UserRole) {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: complaints, status, error } = useAppSelector((state) => state.complaints);

  useEffect(() => {
    if (role && (!requiredRole || role === requiredRole) && status === "idle") {
      void dispatch(fetchUserComplaint(role));
    }
  }, [dispatch, role, status, requiredRole]);

  const retry = () => {
    if (role && (!requiredRole || role === requiredRole) && status !== "loading") {
      void dispatch(fetchUserComplaint(role));
    }
  };

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((complaint) => complaint.status?.toLowerCase() === "pending").length;
  const resolvedComplaints = complaints.filter((complaint) => complaint.status?.toLowerCase() === "resolved").length;
  const rejectedComplaints = complaints.filter((complaint) => complaint.status?.toLowerCase() === "rejected").length;

  return {
    role,
    complaints,
    error,
    status,
    retry,
    hasComplaints: status === "success" && totalComplaints > 0,
    totalComplaints,
    pendingComplaints,
    resolvedComplaints,
    rejectedComplaints,
  };
}
