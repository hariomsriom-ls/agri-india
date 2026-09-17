"use client";

import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/utils/services";
import { clearAuth, setAuth } from "@/features/auth";

export type ProjectUserRole = "worker" | "landowner" | "authority";

export interface UserProject {
  _id: string;
  projectLocation: string;
  projectStartDate: string;
  projectDays: number;
  projectWorkers: string[];
  projectAuthority?: string | null;
  projectLand: string[];
  projectStatus: string;
  projectOutput: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProjectState {
  data: UserProject[];
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  role: ProjectUserRole | null;
  currentRequestId: string | null;
}

const initialState: UserProjectState = {
  data: [],
  status: "idle",
  error: null,
  role: null,
  currentRequestId: null,
};

export const fetchUserProjects = createAsyncThunk<
  UserProject[], ProjectUserRole, { rejectValue: string; state: { projects: UserProjectState } }
>("Projects/fetchProjects", async (role, { rejectWithValue }) => {
  try {
    const response = await api.get<{ data: { ProjectData: UserProject[] } }>(
      `/${role}/get-projects`,
      { withCredentials: true },
    );
    return response.data.data.ProjectData ?? [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch projects");
    }
    return rejectWithValue("Unexpected error occurred while fetching projects");
  }
}, {
  condition: (role, { getState }) => {
    const state = getState().projects;
    return state.status !== "loading" || state.role !== role;
  },
});

const userProjectSlice = createSlice({
  name: "Projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<UserProject[]>) => {
      state.data = action.payload;
    },
    updateProject: (state, action: PayloadAction<Partial<UserProject> & Pick<UserProject, "_id">>) => {
      const index = state.data.findIndex((project) => project._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload };
      }
    },
    clearProjects: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearAuth, () => initialState)
      .addCase(setAuth, () => initialState)
      .addCase(fetchUserProjects.pending, (state, action) => {
        if (state.role !== action.meta.arg) state.data = [];
        state.role = action.meta.arg;
        state.currentRequestId = action.meta.requestId;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.currentRequestId = null;
        state.status = "success";
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.currentRequestId = null;
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch projects";
      });
  },
});

export const { setProjects, updateProject, clearProjects } = userProjectSlice.actions;
export default userProjectSlice.reducer;
