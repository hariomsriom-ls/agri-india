"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserLand } from "@/features/landowner-Worker-authority/landsdata";

export function useFetchLands() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: lands, status, error } = useAppSelector((state) => state.lands);

  useEffect(() => {
    if (role === "landowner" && status === "idle") {
      void dispatch(fetchUserLand());
    }
  }, [dispatch, role, status]);

  const retry = () => {
    if (role === "landowner" && status !== "loading") {
      void dispatch(fetchUserLand());
    }
  };

  return { role, lands, status, error, retry };
}
