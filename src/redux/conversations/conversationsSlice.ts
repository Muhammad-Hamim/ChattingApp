import type { TConversation } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  currentConversation: TConversation | null;
};

const initialState: TInitialState = {
  currentConversation: null,
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
  },
});

export const { setCurrentConversation } = conversationsSlice.actions;
export default conversationsSlice.reducer;
