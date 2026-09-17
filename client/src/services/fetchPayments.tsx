"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserPayments, type PaymentRole } from "@/features/landowner-Worker/paymenthistory";

export function useFetchPayments(requiredRole?: PaymentRole) {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const stored = useAppSelector((state) => state.payments);
  const matchesRole = stored.role === role && (!requiredRole || role === requiredRole);
  const payments = matchesRole ? stored.data : [];
  const status = matchesRole ? stored.status : "idle";
  const error = matchesRole ? stored.error : null;

  useEffect(() => {
    if (role && (!requiredRole || role === requiredRole) && status === "idle") {
      void dispatch(fetchUserPayments(role));
    }
  }, [dispatch, role, status, requiredRole]);

  const retry = () => {
    if (role && (!requiredRole || role === requiredRole) && status !== "loading") {
      void dispatch(fetchUserPayments(role));
    }
  };

  return { role, payments, status, error, retry,
    hasPayments: status === "success" && payments.length > 0,
  };
}
