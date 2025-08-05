// src/hooks/useUserStatus.ts
import { useEffect, useState } from "react";
import { socket } from "@/socket/socket";

interface UserStatus {
  uid: string; // Changed from userId to match server data
  name: string;
  email: string;
  status: "online" | "offline";
  lastSeen: Date;
  conversationId: string;
}

export const useUserStatus = () => {
  const [userStatuses, setUserStatuses] = useState<Map<string, UserStatus>>(
    new Map()
  );

  useEffect(() => {
    if (!socket) return;

    const handleUserStatusChanged = (data: UserStatus) => {
      console.log("👤 [CLIENT] User status changed:", data);

      setUserStatuses((prev) => {
        const newMap = new Map(prev);
        newMap.set(data.uid, {
          // Use uid instead of userId
          ...data,
          lastSeen: new Date(data.lastSeen),
        });
        return newMap;
      });

      // Optional: Show toast notifications
      if (data.status === "online") {
        console.log(`✅ ${data.name} is now online`);
        // toast.success(`${data.name} is now online`);
      } else {
        console.log(`❌ ${data.name} went offline`);
        // toast.info(`${data.name} went offline`);
      }
    };

    // Handle initial user statuses when joining a conversation
    const handleUsersStatus = (users: UserStatus[]) => {
      console.log("👥 [CLIENT] Initial users status:", users);

      setUserStatuses((prev) => {
        const newMap = new Map(prev);
        users.forEach((user) => {
          newMap.set(user.uid, {
            ...user,
            lastSeen: new Date(user.lastSeen),
          });
        });
        return newMap;
      });
    };

    // Listen for real-time user status changes
    socket.on("user-status-changed", handleUserStatusChanged);

    // Listen for initial user statuses (when joining conversation)
    socket.on("users-status", handleUsersStatus);

    // Cleanup listeners
    return () => {
      socket.off("user-status-changed", handleUserStatusChanged);
      socket.off("users-status", handleUsersStatus);
    };
  }, []);

  // Helper functions
  const getUserStatus = (userId: string): UserStatus | null => {
    return userStatuses.get(userId) || null;
  };

  const isUserOnline = (userId: string): boolean => {
    const status = userStatuses.get(userId);
    return status?.status === "online" || false;
  };

  const getLastSeen = (userId: string): Date | null => {
    const status = userStatuses.get(userId);
    return status?.lastSeen || null;
  };

  // Get all online users in a conversation
  const getOnlineUsersInConversation = (
    conversationId: string
  ): UserStatus[] => {
    return Array.from(userStatuses.values()).filter(
      (user) =>
        user.conversationId === conversationId && user.status === "online"
    );
  };

  // Check if any user in conversation is online
  const hasOnlineUsersInConversation = (conversationId: string): boolean => {
    return Array.from(userStatuses.values()).some(
      (user) =>
        user.conversationId === conversationId && user.status === "online"
    );
  };

  return {
    userStatuses,
    getUserStatus,
    isUserOnline,
    getLastSeen,
    getOnlineUsersInConversation,
    hasOnlineUsersInConversation,
  };
};
