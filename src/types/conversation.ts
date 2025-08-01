// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  uid: string;
}
export type TConversation = {
  _id: string;
  type: "DM" | "GROUP";
  status: "pending" | "accepted" | "rejected";
  participants?: {
    name: string;
    email: string;
  };
  lastMessage?: string;
  createdAt: Date;
  updatedAt: Date;
};
// Participant types
export interface Participant {
  user_id: User;
  role: "initiator" | "receiver";
}

// Conversation types
export interface Conversation {
  _id: string;
  type: "DM" | "group";
  participants: Participant[];
  status: "pending" | "accepted" | "rejected";
  initiated_by: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
  read_status: ReadStatus[];
}

// Read status type
export interface ReadStatus {
  user_id: string;
  read_at: string;
}

// API Response wrapper types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Specific API response types
export type ConversationsResponse = ApiResponse<Conversation[]>;
export type ConversationResponse = ApiResponse<Conversation>;

// Frontend display types (transformed from API data)
export interface ConversationDisplay {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
  isGroup?: boolean;
  status: "pending" | "accepted" | "rejected";
  participants: Participant[];
}
