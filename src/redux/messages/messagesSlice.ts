import { auth } from "@/config/firebase";
import type { TMessage } from "@/types/message";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Enhanced state structure for better message management
type TInitialState = {
  messages: TMessage[];
  loading: boolean;
  isTyping: boolean;
  error: string | null;
  hasMoreMessages: boolean; // For pagination
  optimisticMessages: (TMessage & { tempId?: string })[];
};

const initialState: TInitialState = {
  messages: [],
  loading: false,
  error: null,
  isTyping: false,
  hasMoreMessages: true,
  optimisticMessages: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Set error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // 1. SET MESSAGES - Load messages for the first time or replace all
    setMessages: (state, action: PayloadAction<{ messages: TMessage[] }>) => {
      const { messages } = action.payload;
      state.messages = messages;
      state.loading = false;
      state.error = null;
    },

    // 2. ADD SINGLE MESSAGE - Add new message while preserving previous state
    addMessage: (state, action: PayloadAction<TMessage>) => {
      const message = action.payload;
      // Check if message already exists by ID
      const messageExists = state.messages.some(
        (msg) => msg._id === message._id
      );
      if (!messageExists) {
        state.messages.push(message);
      }
    },

    // 3. ADD MULTIPLE MESSAGES - For pagination or bulk loading
    addMessages: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: TMessage[];
        prepend?: boolean;
      }>
    ) => {
      const { messages, prepend = false } = action.payload;

      if (prepend) {
        // Add older messages to the beginning (pagination)
        state.messages = [...messages, ...state.messages];
      } else {
        // Add newer messages to the end
        state.messages.push(...messages);
      }
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    // 4. UPDATE MESSAGE - Update existing message (for status changes, edits)
    updateMessage: (
      state,
      action: PayloadAction<{
        messageId: string;
        updates: Partial<TMessage>;
      }>
    ) => {
      const { messageId, updates } = action.payload;

      const messageIndex = state.messages.findIndex(
        (msg) => msg._id === messageId
      );

      if (messageIndex !== -1) {
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          ...updates,
        };
      }
    },
    // 5. ADD OPTIMISTIC MESSAGE - For instant UI feedback
    addOptimisticMessage: (
      state,
      action: PayloadAction<TMessage & { tempId: string }>
    ) => {
      const message = action.payload;
      if (message.sender.uid === auth.currentUser?.uid) {
        state.optimisticMessages.push(message);
      }
    },

    // 6. CONFIRM OPTIMISTIC MESSAGE - Replace temp with real message
    confirmOptimisticMessage: (
      state,
      action: PayloadAction<{ tempId: string; realMessage: TMessage }>
    ) => {
      const { tempId, realMessage } = action.payload;

      // Remove from optimistic messages
      state.optimisticMessages = state.optimisticMessages.filter(
        (msg) => msg.tempId !== tempId
      );

      // Add real message to main messages
      state.messages.push(realMessage);
    },

    // 7. REMOVE OPTIMISTIC MESSAGE - For failed sends
    removeOptimisticMessage: (state, action: PayloadAction<string>) => {
      const tempId = action.payload;
      state.optimisticMessages = state.optimisticMessages.filter(
        (msg) => msg.tempId !== tempId
      );
    },
    // 8. DELETE MESSAGE
    deleteMessage: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;

      // Remove from main messages
      state.messages = state.messages.filter((msg) => msg._id !== messageId);

      // Remove from optimistic messages
      state.optimisticMessages = state.optimisticMessages.filter(
        (msg) => msg._id !== messageId
      );
    },

    // 9. CLEAR MESSAGES - Clear all messages for current conversation
    clearMessages: (state) => {
      state.messages = [];
      state.optimisticMessages = [];
    },

    // 10. CLEAR ALL - Reset entire state
    clearAllMessages: (state) => {
      state.messages = [];
      state.optimisticMessages = [];
      state.error = null;
      state.loading = false;
      state.hasMoreMessages = true;
    },

    // 11. SET PAGINATION STATE
    setHasMoreMessages: (state, action: PayloadAction<boolean>) => {
      state.hasMoreMessages = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setMessages,
  addMessage,
  addMessages,
  addOptimisticMessage,
  confirmOptimisticMessage,
  removeOptimisticMessage,
  updateMessage,
  deleteMessage,
  setIsTyping,
  clearMessages,
  clearAllMessages,
  setHasMoreMessages,
} = messagesSlice.actions;

export default messagesSlice.reducer;
