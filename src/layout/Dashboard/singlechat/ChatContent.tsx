// ChatContent.tsx - Combine real + optimistic messages without selectors
import { useRef, useEffect, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageCard from "./MessageCard";
import { useParams } from "react-router";
import { useAppSelector } from "@/redux/hooks";
import { useMessages } from "@/hooks/useMessages";

const ChatContent = () => {
  const { conversationId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get both arrays from Redux store directly
  const realMessages = useAppSelector((state) => state.messages.messages);
  const optimisticMessages = useAppSelector(
    (state) => state.messages.optimisticMessages
  );
  const loading = useAppSelector((state) => state.messages.loading);

  // Initialize messages hook
  useMessages(conversationId);

  // 🎯 Combine real + optimistic messages using useMemo
  const allMessages = useMemo(() => {
    const combined = [...realMessages, ...optimisticMessages];

    // Sort by timestamp to maintain proper order
    return combined.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [realMessages, optimisticMessages]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Handle loading state
  if (loading) {
    return (
      <ScrollArea className="h-full w-full scrollbar-custom">
        <div className="flex items-center justify-center h-full min-h-[400px] p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a884] mx-auto mb-4"></div>
            <p className="text-[#8696a0]">Loading messages...</p>
          </div>
        </div>
      </ScrollArea>
    );
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
