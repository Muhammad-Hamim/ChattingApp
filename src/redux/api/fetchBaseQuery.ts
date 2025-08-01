import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Promise to wait for auth initialization
const waitForAuth = (): Promise<void> => {
  return new Promise((resolve) => {
    if (auth.currentUser !== null) {
      resolve();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, () => {
      unsubscribe();
      resolve();
    });
  });
};

// Create a custom fetchBaseQuery that includes Firebase auth token
export const createAuthenticatedBaseQuery = (): BaseQueryFn => {
  return fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
    prepareHeaders: async (headers) => {
      try {
        // Wait for auth to initialize
        await waitForAuth();

        // Get the current user after auth is ready
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Get the ID token from Firebase (this will automatically refresh if needed)
          const token = await currentUser.getIdToken(true); // force refresh if expired
          console.log("Auth token obtained:", token ? "✓" : "✗");

          // Add the token to the Authorization header
          headers.set("Authorization", `Bearer ${token}`);
        } else {
          console.log("No authenticated user found");
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
        // Wait for auth to initialize
        await waitForAuth();

        const currentUser = auth.currentUser;

        if (currentUser) {
          const token = await currentUser.getIdToken(true);
          console.log("Auth token obtained for retry:", token ? "✓" : "✗");
          headers.set("Authorization", `Bearer ${token}`);
        } else {
          console.log("No authenticated user found for retry");
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

    console.log("API Request result:", {
      url: args,
      status: result.error?.status || "success",
      data: result.data ? "received" : "none",
    });

    // If we get a 401 unauthorized, try to refresh the token and retry once
    if (result.error && result.error.status === 401) {
      console.log("Got 401, attempting token refresh...");
      try {
        await waitForAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Force token refresh
          await currentUser.getIdToken(true);
          console.log("Token refreshed, retrying request...");
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
