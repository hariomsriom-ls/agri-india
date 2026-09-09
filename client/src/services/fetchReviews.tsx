"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserReview } from "@/features/landowner-Worker/reviewsdata"; 

export function useFetchReviews() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: reviews, status, error } = useAppSelector((state) => state.reviews,);

  useEffect(() => {
    if (role && status === "idle") {
      void dispatch(fetchUserReview(role));
    }
  }, [dispatch, role, status]);

   const totalReviews = reviews.length;
  const pendingReviews = reviews.filter((complaint) => complaint.status.toLowerCase() === "pending").length;
  const submittedReviews = reviews.filter((complaint) => complaint.status.toLowerCase() === "Submitted").length;

  return {
    role,
    reviews,
    error,
    status,
    hasReviews: status === "success" && totalReviews > 0,
    totalReviews,
    pendingReviews,
    submittedReviews,
  };
}