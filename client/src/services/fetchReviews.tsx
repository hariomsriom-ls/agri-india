"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserReview, type UserRole } from "@/features/landowner-Worker/reviewsdata";

export function useFetchReviews(requiredRole?: UserRole) {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: reviews, status, error } = useAppSelector((state) => state.reviews,);

  useEffect(() => {
    if (role && (!requiredRole || role === requiredRole) && status === "idle") {
      void dispatch(fetchUserReview(role));
    }
  }, [dispatch, role, status, requiredRole]);

  const retry = () => {
    if (role && (!requiredRole || role === requiredRole) && status !== "loading") {
      void dispatch(fetchUserReview(role));
    }
  };

   const totalReviews = reviews.length;
  const pendingReviews = reviews.filter((review) => ["pending", "under review"].includes(review.status?.toLowerCase())).length;
  const submittedReviews = reviews.filter((review) => review.status?.toLowerCase() === "submitted").length;

  return {
    role,
    reviews,
    error,
    status,
    retry,
    hasReviews: status === "success" && totalReviews > 0,
    totalReviews,
    pendingReviews,
    submittedReviews,
  };
}
