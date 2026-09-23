"use client";

import { useEffect } from "react";
import { fetchUserProjects, type ProjectUserRole } from "@/features/landowner-Worker-authority/projectsdata";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useFetchProjects(requiredRole?: ProjectUserRole) {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const stored = useAppSelector((state) => state.projects);
  const matchesRole = stored.role === role && (!requiredRole || role === requiredRole);
  const projects = matchesRole ? stored.data : [];
  const status = matchesRole ? stored.status : "idle";
  const error = matchesRole ? stored.error : null;

  useEffect(() => {
    if (role && (!requiredRole || role === requiredRole) && status === "idle") {
      void dispatch(fetchUserProjects(role));
    }
  }, [dispatch, role, status, requiredRole]);

  const retry = () => {
    if (role && (!requiredRole || role === requiredRole) && status !== "loading") {
      void dispatch(fetchUserProjects(role));
    }
  };

  return {
    role,
    projects,
    status,
    error,
    retry,
    totalProjects: projects.length,
    hasProjects: status === "success" && projects.length > 0,
  };
}
