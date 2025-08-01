import type { TConversation } from "@/layout/Dashboard/chatlists/ChatCard";
import { apiSlice } from "@/redux/api/apiSlice";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // message/chat request (create new DM conversation)
    messageRequest: builder.mutation({
      query: (receiverEmail: string) => {
        return {
          url: "conversation/create",
          method: "POST",
          body: { receiverEmail },
        };
      },
    }),
    // respond to message/chat request
    respondToMessageRequest: builder.mutation({
      query: ({
        conversationId,
        action,
      }: {
        conversationId: string;
        action: boolean;
      }) => {
        return {
          url: `conversation/respond/${conversationId}`,
          method: "POST",
          body: { action },
        };
      },
    }),
    // get all conversations of a user
    getAllConversations: builder.query<
      { success: boolean; message: string; data: TConversation[] },
      void
    >({
      query: () => {
        return {
          url: "conversation/all?sort=-updatedAt",
          method: "GET",
        };
      },
    }),
    //get single conversation by id
    getConversationById: builder.query<
      { success: boolean; message: string; data: TConversation },
      string
    >({
      query: (id: string) => {
        return {
          url: `conversation/${id}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useMessageRequestMutation,
  useRespondToMessageRequestMutation,
  useGetAllConversationsQuery,
  useGetConversationByIdQuery,
} = conversationsApi;
