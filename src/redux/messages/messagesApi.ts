import { apiSlice } from "@/redux/api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Define your authentication-related endpoints here
    }),
})