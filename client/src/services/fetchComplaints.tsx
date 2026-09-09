"use client"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserComplaint } from "@/features/landowner-Worker/complaintsdata"

export function useFetchComplaint() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: complaints, status, error } = useAppSelector((state) => state.complaints);

  useEffect(() => {
    if (role && status === "idle") {
      void dispatch(fetchUserComplaint(role));
    }
  }, [dispatch, role, status]);

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((complaint) => complaint.status.toLowerCase() === "pending").length;
  const resolvedComplaints = complaints.filter((complaint) => complaint.status.toLowerCase() === "resolved").length;
  const rejectedComplaints = complaints.filter((complaint) => complaint.status.toLowerCase() === "rejected").length;

  return {
    role,
    complaints,
    error,
    status,
    hasComplaints: status === "success" && totalComplaints > 0,
    totalComplaints,
    pendingComplaints,
    resolvedComplaints,
    rejectedComplaints,
  };
}