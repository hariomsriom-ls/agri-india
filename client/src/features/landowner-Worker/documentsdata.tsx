"use client"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/services";
import axios from "axios";
import { clearAuth, setAuth } from "@/features/auth";

export type DocumentUserModel = "landowner" | "worker" | "authority";

export interface UserDocument {
  _id: string;
  name: string;
  category: string;
  uploadDate: string;
  fileUrl: string; 
  publicId?: string;
  status?: string;
  documentOf?: string;
  documentOfModel?: DocumentUserModel | "organizationauthority";
  documentFrom?: string | { _id: string; fullName?: string; userName?: string };
  documentFromModel?: DocumentUserModel | "organizationauthority";
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
  role: DocumentUserModel | null;
  currentRequestId: string | null;
  isUploading: boolean;
  uploadError: string | null;
  uploadRequestId: string | null;
}

const initialState: UserDocumentState = {
  data: [],
  status: "idle",
  error: null,
  deletingDocumentId: null,
  role: null,
  currentRequestId: null,
  isUploading: false,
  uploadError: null,
  uploadRequestId: null,
};

export const fetchUserDocuments = createAsyncThunk<UserDocument[],DocumentUserModel,{ rejectValue: string; state: { documents: UserDocumentState } }>(
"Documents/fetchDocuments",
async(role, {rejectWithValue}) => {
    try{
        const response = await api.get(`/${role}/get-documents`, {withCredentials: true});
        const userDocuments: UserDocument[] =response.data.data.Documents ?? [];
        return[...userDocuments]
    }catch(error){
        if(axios.isAxiosError(error)){return rejectWithValue(error.response?.data?.message || "Failed to fetch documents")}
        return rejectWithValue("unexpected Error occured")
    }
}, {
    condition: (role, { getState }) => {
        const state = getState().documents;
        return state.status !== "loading" || state.role !== role;
    },
});

export const uploadUserDocument = createAsyncThunk<
  UserDocument,
  { role: DocumentUserModel; data: FormData },
  { rejectValue: string; state: { documents: UserDocumentState } }
>("Documents/uploadDocument", async ({ role, data }, { rejectWithValue }) => {
  const file = data.get("document");
  const name = data.get("name");
  const category = data.get("category");
  if (!(file instanceof File) || !file.size) return rejectWithValue("Choose a document to upload.");
  if (typeof name !== "string" || !name.trim() || typeof category !== "string" || !category.trim()) {
    return rejectWithValue("Document name and category are required.");
  }
  if (!["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
    return rejectWithValue("Choose a PDF, JPG, or PNG document.");
  }
  if (file.size > 10 * 1024 * 1024) return rejectWithValue("Document must be 10 MB or smaller.");

  const body = new FormData();
  body.append("document", file);
  body.append("name", name.trim());
  body.append("category", category.trim());
  try {
    const response = await api.post<{ data: { document: UserDocument } }>(`/${role}/upload-document`, body, { withCredentials: true });
    return response.data.data.document;
  } catch (error) {
    return rejectWithValue(axios.isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message || "Failed to upload document. Please try again."
      : "Failed to upload document. Please try again.");
  }
}, {
  condition: ({ role }, { getState }) => {
    const state = getState().documents;
    return state.role === role && state.status === "success" && !state.isUploading;
  },
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
        clearDocumentUploadError: (state) => { state.uploadError = null; },
        setDocuments: (state,action:PayloadAction<UserDocument[]>) => {state.data = action.payload;},
        deleteDocuments: (state,action:PayloadAction<UserDocument["_id"]>) =>{
            state.data = state.data.filter(
                (document)=> document._id !== action.payload
            )
            },
        },
    extraReducers: (builder) => {
     builder
    .addCase(clearAuth, () => initialState)
    .addCase(setAuth, () => initialState)
    .addCase(fetchUserDocuments.pending, (state, action) => {
        if (state.role !== action.meta.arg) {
            state.data = [];
            state.isUploading = false;
            state.uploadError = null;
            state.uploadRequestId = null;
        }
        state.role = action.meta.arg;
        state.currentRequestId = action.meta.requestId;
        state.status = "loading";
        state.error = null;
    })
    .addCase(fetchUserDocuments.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = "success";
        state.data = action.payload;
        state.currentRequestId = null;
    })
    .addCase(fetchUserDocuments.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch documents";
        state.currentRequestId = null;
    })
    .addCase(uploadUserDocument.pending, (state, action) => {
        state.isUploading = true;
        state.uploadError = null;
        state.uploadRequestId = action.meta.requestId;
    })
    .addCase(uploadUserDocument.fulfilled, (state, action) => {
        if (state.uploadRequestId !== action.meta.requestId || state.role !== action.meta.arg.role) return;
        state.data = [action.payload, ...state.data.filter(document => document._id !== action.payload._id)];
        state.isUploading = false;
        state.uploadRequestId = null;
    })
    .addCase(uploadUserDocument.rejected, (state, action) => {
        if (state.uploadRequestId !== action.meta.requestId) return;
        state.isUploading = false;
        state.uploadError = action.payload ?? "Failed to upload document. Please try again.";
        state.uploadRequestId = null;
    })
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
export const {setDocuments,deleteDocuments,clearDocumentUploadError} = UserDocumentSlice.actions

export default UserDocumentSlice.reducer;

