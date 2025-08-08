// ChatContent.tsx - Combine real + optimistic messages without selectors
import { useRef, useEffect, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageCard from "./MessageCard";
import { useParams } from "react-router";
import { useAppSelector } from "@/redux/hooks";
import { useMessages } from "@/hooks/useMessages";
import { auth } from "@/config/firebase";
import ChatLoader from "@/components/loadingSkeleton/ChatLoader";

const ChatContent = () => {
  const { conversationId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get both arrays from Redux store directly
  const {
    messages: realMessages,
    optimisticMessages,
    loading,
  } = useAppSelector((state) => state.messages);
  // Get current user ID
  const currentUserId = auth.currentUser?.uid;
  // Initialize messages hook
  useMessages(conversationId);

  // 🎯 Only combine optimistic messages if current user is the sender
  const allMessages = useMemo(() => {
    // Filter optimistic messages to only those sent by the current user
    const myOptimisticMessages = optimisticMessages.filter(
      (msg) => msg.sender?.uid === currentUserId
    );
    const combined = [...realMessages, ...myOptimisticMessages];

    // Sort by timestamp to maintain proper order
    return combined.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [realMessages, optimisticMessages, currentUserId]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Handle loading state
  if (loading) {
    return <ChatLoader />;
  }

  return (
    <ScrollArea className="h-full w-full  pb-20">
      <div className="p-4 min-h-full flex flex-col ">
        <div className="w-full max-w-none space-y-4 ">
          {allMessages.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-[#8696a0]">No messages yet</p>
                <p className="text-[#8696a0] text-sm mt-2">
                  Start a conversation!
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* 🎯 Display combined messages (real + optimistic) */}
              {allMessages.map((message) => (
                <MessageCard
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  key={message._id || `temp-${(message as any).tempId}`}
                  {...message}
                />
              ))}
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ChatContent;
