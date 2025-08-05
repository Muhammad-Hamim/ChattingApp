export type TMessage = {
  _id: string;
  conversation_id: string;
  sender: {
    uid: string;
    email: string;
    name: string;
  };
  type: "text" | "image";
  content: string;
  status: "sent" | "delivered" | "read";
  edited: boolean;
  metadata?: {
    is_forwarded?: boolean;
    forwarded_from?: string;
    forwarded_time?: Date;

    // Optional fields for ephemeral messages (auto-delete)
    expires_at?: Date;
  };
  deleted_history?: {
    deleted_for: "me" | "everyone";
    user_id: string;
    time: Date;
  }[];
  reaction?: {
    user_id: string;
    emoji: string;
    reacted_at: Date;
  }[];
  createdAt: Date | string;
  updatedAt: Date | string;
  reply_to?: string | null;
};
