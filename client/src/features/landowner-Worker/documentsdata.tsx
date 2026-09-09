"use client"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/services";
import axios from "axios";

export type DocumentUserModel = "landowner" | "worker" | "authority";

export interface UserDocument {
  _id: string;
  name: string;
  category: string;
  uploadDate: string;
  fileUrl: string; 
  publicId: string; 
  resourceType?: string;
  format?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDocumentState {
  data: UserDocument[];
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  deletingDocumentId: string | null;
}

const initialState: UserDocumentState = {
  data: [],
  status: "idle",
  error: null,
  deletingDocumentId: null,
};

export const fetchUserDocuments = createAsyncThunk<UserDocument[],DocumentUserModel,{ rejectValue: string }>(
"Documents/fetchDocuments",
async(role, {rejectWithValue}) => {
    try{
        const response = await api.get(`/${role}/get-documents`, {withCredentials: true});
        const userDocuments: UserDocument[] =response.data.data.Documents ?? [];
        return[...userDocuments]
    }catch(error){
        if(axios.isAxiosError(error)){return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications")}
        return rejectWithValue("unexpected Error occured")
    }
});

export const deleteUserDocuments = createAsyncThunk<string,{ documentId: string; role: DocumentUserModel },{ rejectValue: string }>(
  "Documents/deletedocument",
  async ({ documentId, role }, { rejectWithValue }) => {
    try {
      await api.delete(`/${role}/delete-document/${documentId}`,{ withCredentials: true }
      );
      return documentId;
    } catch (error) {
      if (axios.isAxiosError(error)) {return rejectWithValue(error.response?.data?.message ??"Failed to delete document");
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

const UserDocumentSlice = createSlice({
    name:"Documents",
    initialState,
    reducers: {
        setDocuments: (state,action:PayloadAction<UserDocument[]>) => {state.data = action.payload;},
        deleteDocuments: (state,action:PayloadAction<UserDocument["_id"]>) =>{
            state.data = state.data.filter(
                (document)=> document._id !== action.payload
            )
            },
        },
    extraReducers: (builder) => {
     builder
    .addCase(fetchUserDocuments.pending, (state) => {state.status = "loading";state.error = null;})
    .addCase(fetchUserDocuments.fulfilled, (state, action) => {state.status = "success";state.data = action.payload;})
    .addCase(fetchUserDocuments.rejected, (state, action) => {state.status = "failed";state.error = action.payload ?? "Failed to fetch documents";})
    .addCase(deleteUserDocuments.pending, (state, action) => {state.error = null; state.deletingDocumentId = action.meta.arg.documentId})
    .addCase(deleteUserDocuments.fulfilled, (state, action) => {state.status = "success";state.data = state.data.filter((document)=> document._id != action.payload);
    state.deletingDocumentId = null;   
    })
    .addCase(deleteUserDocuments.rejected, (state, action) => {state.status = "failed";state.error = action.payload ?? "Failed to fetch documents";
        state.deletingDocumentId = null;
    })

},

    }
)
export const {setDocuments,deleteDocuments} = UserDocumentSlice.actions

export default UserDocumentSlice.reducer;

