import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Async Thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", {
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.get("/auth/logout");
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed",
      );
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Authentication failed",
      );
    }
  },
);

// Safe LocalStorage helpers
// Both "user" and "token" now use the same guard against the literal
// strings "undefined" / "null", which is what was leaking through as
// a truthy value and showing up as "undefined" after a refresh.
const getSavedUser = () => {
  try {
    const item = localStorage.getItem("user");
    if (!item || item === "undefined" || item === "null") return null;
    return JSON.parse(item);
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

const getSavedToken = () => {
  const item = localStorage.getItem("token");
  if (!item || item === "undefined" || item === "null") return null;
  return item;
};

const savedUser = getSavedUser();
const savedToken = getSavedToken();

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!(savedUser || savedToken),
  status: "loading",
  error: null,
  loading: true,
};

const clearStoredAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      state.loading = false;
      clearStoredAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        // Derived from what actually came back, instead of a hardcoded
        // true — avoids "authenticated" state with a null user.
        state.isAuthenticated = !!(action.payload?.user || action.payload?.token);

        if (action.payload?.user) {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
        if (action.payload?.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.isAuthenticated = !!(action.payload?.user || action.payload?.token);

        if (action.payload?.user) {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
        if (action.payload?.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.loading = false;
        state.error = null;
        clearStoredAuth();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearStoredAuth();
      })

      // getMe cases
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.user || action.payload?.data || null;
        state.user = user;
        state.token = state.token || null;
        state.isAuthenticated = !!user;

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearStoredAuth();
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;