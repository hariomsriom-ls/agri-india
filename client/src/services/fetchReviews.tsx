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

  return { role, reviews, status, error,
    hasReviews: status === "success" && reviews.length > 0,
  };
}