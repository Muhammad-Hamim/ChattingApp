import type { Conversation, ConversationDisplay } from "@/types";

// Transform API conversation data to display format
export const transformConversationToDisplay = (
  conversation: Conversation
): ConversationDisplay => {
  // Get the other participant (not the current user)
  const otherParticipant =
    conversation.participants.find(
      (p) => p.role !== "initiator" // This logic might need adjustment based on current user
    )?.user_id || conversation.participants[0]?.user_id;

  // Generate display name
  const displayName =
    conversation.type === "group"
      ? `Group (${conversation.participants.length} members)`
      : otherParticipant?.name || "Unknown User";

  // Format time (you can enhance this with proper date formatting)
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return {
    id: conversation._id,
    name: displayName,
    lastMessage:
      conversation.status === "pending"
        ? `${conversation.initiated_by.name} sent a message request`
        : "No messages yet",
    time: formatTime(conversation.updatedAt),
    unread: conversation.status === "pending" ? 1 : 0,
    avatar: `/avatars/${
      otherParticipant?.name?.toLowerCase() || "default"
    }.jpg`,
    online: false, // You'll need to implement online status logic
    isGroup: conversation.type === "group",
    status: conversation.status,
    participants: conversation.participants,
  };
};

// Transform array of conversations
export const transformConversationsToDisplay = (
  conversations: Conversation[]
): ConversationDisplay[] => {
  return conversations.map(transformConversationToDisplay);
};
