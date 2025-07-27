/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApi } from "@reduxjs/toolkit/query/react";
import { authenticatedBaseQuery } from "./fetchBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: authenticatedBaseQuery,
  tagTypes: [],
  endpoints: (_builder) => ({}),
});
