"use client";

import { useMemo, useState } from "react";
import type {
  PaymentStatus,
  UserPayment,
} from "@/features/landowner-Worker/paymenthistory";

export type PaymentFilter = "All" | PaymentStatus;

function partyName(party: UserPayment["PaymentFrom"]) {
  return Array.isArray(party) ? party[0]?.fullName ?? "" : "";
}

export function useVisiblePayments(
  payments: UserPayment[],
  search: string,
) {
  const [filterStatus, setFilterStatus] = useState<PaymentFilter>("All");

  const visiblePayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const searchableText = [
        payment.transactionId,
        payment.paymentType,
        payment.paymentMethod,
        partyName(payment.PaymentFrom),
        partyName(payment.PaymentTo),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !term || searchableText.includes(term);
      const matchesStatus =
        filterStatus === "All" || payment.paymentStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, filterStatus]);

  return { visiblePayments, filterStatus, setFilterStatus };
}
