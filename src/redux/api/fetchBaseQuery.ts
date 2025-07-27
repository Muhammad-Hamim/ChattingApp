import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { auth } from "@/config/firebase";

// Create a custom fetchBaseQuery that includes Firebase auth token
export const createAuthenticatedBaseQuery = (): BaseQueryFn => {
  return fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
    prepareHeaders: async (headers) => {
      try {
        // Get the current user
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Get the ID token from Firebase (this will automatically refresh if needed)
          const token = await currentUser.getIdToken(true); // force refresh if expired

          // Add the token to the Authorization header
          headers.set("Authorization", `Bearer ${token}`);
        }

        // Set content type for JSON requests
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }

        return headers;
      } catch (error) {
        console.error("Error getting auth token:", error);
        // Continue without token if there's an error
        return headers;
      }
    },
  });
};

// Enhanced version with retry logic for token refresh
export const createAuthenticatedBaseQueryWithRetry = (): BaseQueryFn => {
  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
    prepareHeaders: async (headers) => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const token = await currentUser.getIdToken(true);
          headers.set("Authorization", `Bearer ${token}`);
        }

        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }

        return headers;
      } catch (error) {
        console.error("Error getting auth token:", error);
        return headers;
      }
    },
  });

  return async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // If we get a 401 unauthorized, try to refresh the token and retry once
    if (result.error && result.error.status === 401) {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Force token refresh
          await currentUser.getIdToken(true);
          // Retry the request
          result = await baseQuery(args, api, extraOptions);
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        // If refresh fails, return the original error
      }
    }

    return result;
  };
};

// Export the configured base query (using the enhanced version by default)
export const authenticatedBaseQuery = createAuthenticatedBaseQueryWithRetry();
