import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const fetchFiles = createAsyncThunk('files/fetchFiles', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/files`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch files');
  }
});

export const uploadFile = createAsyncThunk('files/uploadFile', async (file, { dispatch, rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/upload`, formData);
    dispatch(fetchFiles());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Upload failed');
  }
});

const fileSlice = createSlice({
  name: 'files',
  initialState: {
    items: [],
    loading: false,
    error: null,
    uploading: false,
    uploadStatus: null, // 'success', 'error'
  },
  reducers: {
    clearUploadStatus: (state) => {
      state.uploadStatus = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload File
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
        state.uploadStatus = null;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.uploading = false;
        state.uploadStatus = 'success';
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.uploadStatus = 'error';
        state.error = action.payload;
      });
  },
});

export const { clearUploadStatus } = fileSlice.actions;
export default fileSlice.reducer;
