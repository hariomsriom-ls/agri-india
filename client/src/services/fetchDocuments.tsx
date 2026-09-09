"use client"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserDocuments } from "@/features/landowner-Worker/documentsdata"

export function useFetchDocuments() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: documents, status, error } = useAppSelector((state) => state.documents);

  useEffect(() => {
    if (role && status === "idle") {
      void dispatch(fetchUserDocuments(role));
    }
  }, [dispatch, role, status]);

  return { role, documents, status, error,
    hasdocuments: status === "success" && documents.length > 0,
  };
}