"use client";

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/services";
import axios from "axios";

export interface LandRecord {
    _id: string;
    landowner: string;
    landStatus: string;
    landArea: number;
    landCity: string;
    landLocation: string;
    landDocuments: string;
    authorityAssigned?: string;
    rentPeriod?: number;
    equipmentAssigned?: string[];
    materialUsed?: string[];
    productOutput?: number;
    productDetails?: Record<string, unknown>;
    landquality?: string;
    landRentPayments?: number;
    landLeaseAgreements?: string;
    cultivationPeriod?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface UserLandState {
    data: LandRecord[];
    status: "idle" | "loading" | "success" | "failed";
    error: string | null;
}

const initialState: UserLandState = {
    data: [],
    status: "idle",
    error: null,
};

export const fetchUserLand = createAsyncThunk<LandRecord[], void, { rejectValue: string }>(
    "Lands/fetchLand",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: { LandRecordData?: LandRecord[] } }>(
                "/landowner/get-land-details",
                { withCredentials: true }
            );
            return response.data.data.LandRecordData ?? [];
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch land records");
            }
            return rejectWithValue("An unexpected error occurred");
        }
    }
);

const UserLandSlice = createSlice({
    name: "Lands",
    initialState,
    reducers: {
        setLands: (state, action: PayloadAction<LandRecord[]>) => {
            state.data = action.payload;
        },
        updateLand: (state, action: PayloadAction<Partial<LandRecord> & Pick<LandRecord, "_id">>) => {
            const index = state.data.findIndex((land) => land._id === action.payload._id);
            if (index !== -1) {
                state.data[index] = { ...state.data[index], ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserLand.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchUserLand.fulfilled, (state, action) => {
                state.status = "success";
                state.data = action.payload;
            })
            .addCase(fetchUserLand.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to fetch land records";
            });
    },
});

export const { setLands, updateLand } = UserLandSlice.actions;
export default UserLandSlice.reducer;
