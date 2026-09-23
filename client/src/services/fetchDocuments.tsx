"use client"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserDocuments, type DocumentUserModel } from "@/features/landowner-Worker-authority/documentsdata"

export function useFetchDocuments(requiredRole?: DocumentUserModel) {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data, status: storedStatus, error: storedError, role: documentRole, isUploading, uploadError } = useAppSelector((state) => state.documents);
  const documents = documentRole === role ? data : [];
  const status = documentRole === role ? storedStatus : "idle";
  const error = documentRole === role ? storedError : null;

  useEffect(() => {
    if (role && (!requiredRole || role === requiredRole) && status === "idle") {
      void dispatch(fetchUserDocuments(role));
    }
  }, [dispatch, role, status, requiredRole]);

  const retry = () => {
    if (role && (!requiredRole || role === requiredRole) && status !== "loading") {
      void dispatch(fetchUserDocuments(role));
    }
  };

  return { role, documents, status, error, retry,
    isUploading: documentRole === role && isUploading,
    uploadError: documentRole === role ? uploadError : null,
    hasdocuments: status === "success" && documents.length > 0,
  };
}
