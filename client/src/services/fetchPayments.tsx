"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserPayments } from "@/features/landowner-Worker/paymenthistory"; 

export function useFetchPayments() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: payments, status, error } = useAppSelector(
    (state) => state.payments,
  );

  useEffect(() => {
    if (role && status === "idle") {
      void dispatch(fetchUserPayments(role));
    }
  }, [dispatch, role, status]);

  return {
    role,
    payments,
    status,
    error,
    hasPayments: status === "success" && payments.length > 0,
  };
}
