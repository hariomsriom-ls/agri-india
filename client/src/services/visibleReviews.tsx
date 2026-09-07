"use client";

import { useMemo, useState } from "react";
import type {ReviewCategory,Reviews,ReviewStatus,} from "@/features/landowner-Worker/reviewsdata";

export type CategoryFilter = "All Categories" | ReviewCategory;
export type StatusFilter = "All Status" | ReviewStatus;

export function useVisibleReviews(reviews: Reviews[], search: string) {
  const [categoryFilter, setCategoryFilter] =useState<CategoryFilter>("All Categories");
  const [statusFilter, setStatusFilter] =useState<StatusFilter>("All Status");

  const visibleReviews = useMemo(() => {
    const term = search.trim().toLowerCase();

    return reviews.filter((item) => {
      const reviewText = typeof item.review === "string"? item.review: item.review.map((reviewer) => reviewer.fullName).join(" ");

      const searchableText = [
        item._id,
        item.category,
        item.title,
        reviewText,
        item.status,
      ].join(" ").toLowerCase();

      const matchesSearch = term.length === 0 || searchableText.includes(term);

      const matchesCategory =categoryFilter === "All Categories" ||item.category === categoryFilter;

      const matchesStatus =statusFilter === "All Status" ||item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [reviews, search, categoryFilter, statusFilter]);

  return {
    visibleReviews,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
  };
}