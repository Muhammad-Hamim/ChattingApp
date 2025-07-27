import { apiSlice } from "@/redux/api/apiSlice";

export const conversationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Define your conversations-related endpoints here
    }),
})