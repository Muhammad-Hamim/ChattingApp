import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { socket } from "@/socket/socket";
import { useAppDispatch } from "@/redux/hooks";
import {
  addOptimisticMessage,
  removeOptimisticMessage,
} from "@/redux/messages/messagesSlice";
import { auth } from "@/config/firebase";
import { toast } from "sonner";
import { useParams } from "react-router";
import type { TMessage } from "@/types/message";
import { FiPlus } from "react-icons/fi";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import EmojiPicker, {
  type EmojiClickData,
  EmojiStyle,
  SkinTones,
  Theme,
  SuggestionMode,
  SkinTonePickerLocation,
} from "emoji-picker-react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const { conversationId } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 150; // Match your max-height

      if (scrollHeight > 40) {
        // Single line height
        setIsExpanded(true);
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      } else {
        setIsExpanded(false);
        textarea.style.height = "40px";
      }
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [message, adjustHeight]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newMessage =
          message.slice(0, start) + emojiData.emoji + message.slice(end);
        setMessage(newMessage);

        // Set cursor position after the emoji
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + emojiData.emoji.length;
          textarea.focus();
        }, 0);
      }
      setShowEmojiPicker(false);
    },
    [message]
  );

  const handleSend = () => {
    if (!message.trim() || !conversationId || isSending) return;

    const user = auth.currentUser;
    if (!user) {
      toast.error("Please log in to send messages");
      return;
    }

    setIsSending(true);
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const messageContent = message.trim();

    // 1. 🎯 CREATE OPTIMISTIC MESSAGE
    const optimisticMessage: TMessage & { tempId: string } = {
      _id: tempId,
      content: messageContent,
      conversation_id: conversationId,
      sender: {
        uid: user.uid,
        email: user.email || "",
        name: user.displayName || user.email?.split("@")[0] || "You",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "text",
      status: "sent",
      edited: false,
      tempId,
    };

    // 2. 🎯 ADD TO REDUX STORE IMMEDIATELY
    dispatch(addOptimisticMessage(optimisticMessage));

    // 3. Clear input immediately for better UX
    setMessage("");
    setIsExpanded(false);

    // 4. Send to server
    socket.emit(
      "send-message",
      {
        conversationId,
        content: messageContent,
        tempId, // Include tempId for server to match
      },
      (response: Record<string, unknown>) => {
        setIsSending(false);
        if (response.success) {
          console.log("✅ Message sent successfully");
          // Real message will be handled by socket listener in useMessages
        } else {
          console.error("❌ Failed to send message:", response.error);
          // Remove optimistic message on failure
          dispatch(removeOptimisticMessage(tempId));
          // Restore message in input
          setMessage(messageContent);
          toast.error("Failed to send message. Please try again.");
        }
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  return (
    <div className="relative">
      {/* Enhanced Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full mb-2 left-12 z-50"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={Theme.DARK}
            emojiStyle={EmojiStyle.NATIVE}
            width={380}
            height={450}
            searchDisabled={false}
            skinTonesDisabled={false}
            previewConfig={{
              showPreview: true,
              defaultEmoji: "1f60a",
              defaultCaption: "What's your mood?",
            }}
            searchPlaceHolder="Search emojis..."
            defaultSkinTone={SkinTones.NEUTRAL}
            emojiVersion="5.0"
            suggestedEmojisMode={SuggestionMode.RECENT}
            skinTonePickerLocation={SkinTonePickerLocation.SEARCH}
            autoFocusSearch={false}
          />
        </div>
      )}

      {/* Message Input */}
      <div
        className={`bg-[#242626] flex gap-2 px-3 py-1 ${
          isExpanded ? "rounded-lg items-end" : "rounded-full items-center"
        }`}
      >
        {/* Left side buttons */}
        <div
          className={`flex gap-1 flex-shrink-0 ${
            isExpanded ? "items-end pb-2" : "items-center"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:text-white hover:bg-gray-700 rounded-full"
          >
            <FiPlus className="text-2xl" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:text-white hover:bg-gray-700 rounded-full"
            onClick={toggleEmojiPicker}
            aria-label="Add emoji"
          >
            <MdOutlineEmojiEmotions className="h-6 w-6" />
          </Button>
        </div>

        {/* Textarea container */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isSending}
            className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none border-none focus:ring-0 focus-visible:ring-0 text-sm leading-6 min-h-[40px] max-h-[150px] overflow-y-auto scrollbar-custom py-2 px-3 rounded-lg"
          />
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          size="icon"
          className={`h-9 w-9 rounded-full bg-[#00a884] hover:bg-[#00a884]/80 text-white disabled:opacity-50 flex-shrink-0 ${
            isExpanded ? "self-end mb-2" : ""
          }`}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <IoSendSharp className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
