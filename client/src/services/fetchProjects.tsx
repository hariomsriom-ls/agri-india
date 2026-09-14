"use client";

import { useEffect } from "react";
import { fetchUserProjects } from "@/features/landowner-Worker/projectsdata";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useFetchProjects() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: projects, status, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (role && status === "idle") {
      void dispatch(fetchUserProjects(role));
    }
  }, [dispatch, role, status]);

  return {
    role,
    projects,
    status,
    error,
    totalProjects: projects.length,
    hasProjects: status === "success" && projects.length > 0,
  };
}
