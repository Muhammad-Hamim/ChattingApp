// useMessages.ts - Fixed to prevent duplicates
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetConversationMessagesQuery } from "@/redux/messages/messagesApi";
import {
  setMessages,
  addMessage,
  setLoading,
  setError,
  removeOptimisticMessage,
  updateMessageStatus,
} from "@/redux/messages/messagesSlice";
import { socket } from "@/socket/socket";
import type { TMessage } from "@/types/message";
import { toast } from "sonner";
import { auth } from "@/config/firebase";

export const useMessages = (conversationId: string | undefined) => {
  const dispatch = useAppDispatch();

  const { messages, optimisticMessages, loading, error } = useAppSelector(
    (state) => state.messages
  );

  // API query
  const {
    data: messagesResponse,
    isLoading,
    isFetching,
    error: apiError,
    refetch,
  } = useGetConversationMessagesQuery(conversationId as string, {
    skip: !conversationId,
  });

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) return;

    dispatch(setLoading(isLoading));

    if (apiError) {
      dispatch(setError("Failed to load messages"));
    }

    if (messagesResponse?.data && !isLoading && !isFetching && !apiError) {
      console.log("📥 Loading messages into Redux store");
      dispatch(setMessages({ messages: messagesResponse.data }));
    }
  }, [
    conversationId,
    messagesResponse,
    isLoading,
    isFetching,
    apiError,
    dispatch,
  ]);

  // Socket listeners for real-time updates
  useEffect(() => {
    if (!conversationId) return;

    const currentUserId = auth.currentUser?.uid;

    const handleNewMessage = (messageData: {
      message: TMessage;
      tempId?: string;
    }) => {
      console.log("📨 New message from server:", messageData);
      if (messageData.message.conversation_id === conversationId) {
        if (messageData.message.sender?.uid !== currentUserId) {
          // Only add if it's NOT our message (prevent duplicates)
          console.log("📨 Adding message from other user");

          // Check if message already exists to prevent duplicates
          const messageExists = messages.some(
            (msg) => msg._id === messageData.message._id
          );
          if (!messageExists) {
            dispatch(addMessage(messageData.message));
            socket.emit("message-delivered", {
              messageId: messageData.message._id,
            });
          }
        }
        // ✅ If it's our message without tempId, ignore it (already handled by optimistic)
      }
    };

    const handleMessageError = (errorData: {
      tempId?: string;
      error: string;
      message?: string;
    }) => {
      console.error("❌ Message send error:", errorData);

      if (errorData.tempId) {
        dispatch(removeOptimisticMessage(errorData.tempId));
      }

      toast.error("Message failed", {
        description: errorData.message || "Failed to send message",
      });
    };
    const handleOnConnectMessageStatusUpdate = (data: {
      messageId: string;
    }) => {
      dispatch(
        updateMessageStatus({ messageId: data.messageId, status: "delivered" })
      );
    };

    const handleMessageStatusUpdate = (data: {
      messageId: string;
      status: "delivered" | "read";
    }) => {
      dispatch(
        updateMessageStatus({ messageId: data.messageId, status: data.status })
      );
    };

    socket.on("new-message", handleNewMessage);
    socket.on("message-error", handleMessageError);
    socket.on("mark-message-delivered", handleOnConnectMessageStatusUpdate);
    socket.on("message-status-update", handleMessageStatusUpdate);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("message-error", handleMessageError);
      socket.off("mark-message-delivered", handleOnConnectMessageStatusUpdate);
      socket.off("message-status-update", handleMessageStatusUpdate);
    };
  }, [conversationId, dispatch, messages]); // Added messages to dependencies

  return {
    messages,
    optimisticMessages,
    loading: loading || isLoading,
    error: error || apiError,
    refetch,
  };
};
