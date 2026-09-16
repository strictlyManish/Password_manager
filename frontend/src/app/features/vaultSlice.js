import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const API_URL = "/vault/";

// 1. Create new collection
export const createCollection = createAsyncThunk(
  "vault/create",
  async (collectionData, thunkAPI) => {
    try {
      // No need to pass headers manually, the interceptor handles it!
      const response = await api.post(API_URL, collectionData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 2. Get all collections
export const getAllCollections = createAsyncThunk(
  "vault/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(API_URL);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 3. Get single collection by ID
export const getCollectionById = createAsyncThunk(
  "vault/getById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(API_URL + id);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 4. Update collection
export const updateCollection = createAsyncThunk(
  "vault/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(API_URL + id, data);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 5. Delete collection
export const deleteCollection = createAsyncThunk(
  "vault/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(API_URL + id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  collections: [],
  collection: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const vaultSlice = createSlice({
  name: "vault",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    clearSingleCollection: (state) => {
      state.collection = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createCollection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const newItem = action.payload.data || action.payload;

        if (newItem) {
          state.collections.unshift(newItem);
        }
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get All
      .addCase(getAllCollections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.collections = action.payload;
      })
      .addCase(getAllCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get Single
      .addCase(getCollectionById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCollectionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.collection = action.payload;
      })
      .addCase(getCollectionById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update
      .addCase(updateCollection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.collections.findIndex(
          (c) => c._id === action.payload._id,
        );
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
        state.collection = action.payload;
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete
      .addCase(deleteCollection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.collections = state.collections.filter(
          (collection) => collection._id !== action.payload,
        );
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearSingleCollection } = vaultSlice.actions;
export default vaultSlice.reducer;
