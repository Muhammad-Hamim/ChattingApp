// useMessages.ts - Fixed to prevent duplicates
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetConversationMessagesQuery } from "@/redux/messages/messagesApi";
import {
  setMessages,
  addMessage,
  setLoading,
  setError,
  confirmOptimisticMessage,
  removeOptimisticMessage,
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
        // ✅ Check if this is OUR message with tempId (optimistic confirmation)
        if (
          messageData?.tempId &&
          messageData.message.sender?.uid === currentUserId
        ) {
          // This is confirmation of our sent message - replace optimistic
          console.log("🔄 Confirming optimistic message:", messageData.tempId);
          dispatch(
            confirmOptimisticMessage({
              tempId: messageData.tempId,
              realMessage: messageData.message,
            })
          );
        }
        // ✅ This is a message from someone else OR our message without tempId
        else if (messageData.message.sender?.uid !== currentUserId) {
          // Only add if it's NOT our message (prevent duplicates)
          console.log("📨 Adding message from other user");

          // Check if message already exists to prevent duplicates
          const messageExists = messages.some(
            (msg) => msg._id === messageData.message._id
          );
          if (!messageExists) {
            dispatch(addMessage(messageData.message));
            //update message status to delivered
            socket.emit("update-message-status", {
              messageId: messageData.message._id,
              status: "delivered",
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

    socket.on("new-message", handleNewMessage);
    socket.on("message-error", handleMessageError);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("message-error", handleMessageError);
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
