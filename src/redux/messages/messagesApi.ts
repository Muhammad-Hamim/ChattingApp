import { apiSlice } from "@/redux/api/apiSlice";
import type { TMessage } from "@/types/message";

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Define your authentication-related endpoints here
    getConversationMessages: builder.query<
      { success: boolean; message: string; data: TMessage[] },
      string
    >({
      query: (conversationId: string) => {
        return {
          url: `/message/${conversationId}?sort=-createdAt`,
          method: "GET",
        };
      },
    }),
  }),
});


export const { useGetConversationMessagesQuery } = messagesApi;