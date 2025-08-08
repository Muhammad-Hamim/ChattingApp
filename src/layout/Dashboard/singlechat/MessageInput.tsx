import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { socket } from "@/socket/socket";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addOptimisticMessage,
  removeOptimisticMessage,
  setIsTyping,
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

// Form interface
interface MessageForm {
  message: string;
}

const MessageInput = () => {
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isTyping } = useAppSelector((state) => state.messages);
  const dispatch = useAppDispatch();
  const { conversationId } = useParams();
  const user = auth.currentUser;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MessageForm>({
    defaultValues: {
      message: "",
    },
    mode: "onChange",
  });

  // Watch the isTyping state
  useEffect(() => {
    if (!conversationId && !user) return;
    socket.on(
      "typing-start",
      (data: { conversationId: string; uid: string }) => {
        if (data.conversationId === conversationId && data.uid !== user?.uid) {
          dispatch(setIsTyping(true));
        }
      }
    );
    socket.on(
      "typing-stop",
      (data: { conversationId: string; uid: string }) => {
        if (data.conversationId === conversationId && data.uid !== user?.uid) {
          dispatch(setIsTyping(false));
        }
      }
    );
    return () => {
      socket.off("typing-start");
      socket.off("typing-stop");
    };
  }, [conversationId, user, dispatch]);

  // Watch the message value for auto-resize
  const messageValue = watch("message");

  // Auto-resize functionality
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 150;

      if (scrollHeight > 40) {
        setIsExpanded(true);
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      } else {
        setIsExpanded(false);
        textarea.style.height = "40px";
      }
    }
  }, []);

  // Adjust height when message changes
  useEffect(() => {
    adjustHeight();
  }, [messageValue, adjustHeight]);

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

  // Typing activity handler
  const handleTypingActivity = useCallback(
    (value: string) => {
      if (!conversationId) return;

      // Emit typing start
      if (!isTyping && value.trim()) {
        socket.emit("typing-start", { conversationId });
      }

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        dispatch(setIsTyping(false));
        socket.emit("typing-stop", { conversationId });
      }, 2000);

      // If message is empty, stop typing immediately
      if (!value.trim() && isTyping) {
        dispatch(setIsTyping(false));
        socket.emit("typing-stop", { conversationId });
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
    [conversationId, isTyping]
  );

  // Handle emoji click
  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = messageValue || "";
        const newMessage =
          currentValue.slice(0, start) +
          emojiData.emoji +
          currentValue.slice(end);

        // Update form value
        setValue("message", newMessage);

        // Set cursor position after the emoji
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + emojiData.emoji.length;
          textarea.focus();
        }, 0);
      }
      setShowEmojiPicker(false);
    },
    [messageValue, setValue]
  );

  // Form submission handler
  const onSubmit = (data: MessageForm) => {
    if (!data.message.trim() || !conversationId || isSending) return;

    if (!user) {
      toast.error("Please log in to send messages");
      return;
    }

    setIsSending(true);
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const messageContent = data.message.trim();

    // Stop typing activity
    dispatch(setIsTyping(false));
    socket.emit("typing-stop", { conversationId });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

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
      createdAt: new Date().toISOString(), // Use ISO string for serialization
      updatedAt: new Date().toISOString(), // Use ISO string for serialization
      type: "text",
      status: "sent",
      edited: false,
      tempId,
    };

    // 2. 🎯 ADD TO REDUX STORE IMMEDIATELY
    dispatch(addOptimisticMessage(optimisticMessage));

    // 3. Clear form immediately for better UX
    reset();
    setIsExpanded(false);

    // 4. Send to server
    socket.emit(
      "send-message",
      {
        conversationId,
        content: messageContent,
        tempId,
      },
      (response: Record<string, unknown>) => {
        setIsSending(false);
        if (response.success) {
          console.log("✅ Message sent successfully");
        } else {
          console.error("❌ Failed to send message:", response.error);
          // Remove optimistic message on failure
          dispatch(removeOptimisticMessage(tempId));
          // Restore message in form
          setValue("message", messageContent);
          toast.error("Failed to send message. Please try again.");
        }
      }
    );
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  // Toggle emoji picker
  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Stop typing when component unmounts
      if (isTyping && conversationId) {
        socket.emit("typing-stop", { conversationId });
        dispatch(setIsTyping(false));
      }
    };
  }, [isTyping, conversationId, dispatch]);

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

      {/* Message Input Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
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
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:text-white hover:bg-gray-700 rounded-full"
            >
              <FiPlus className="text-2xl" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:text-white hover:bg-gray-700 rounded-full"
              onClick={toggleEmojiPicker}
              aria-label="Add emoji"
            >
              <MdOutlineEmojiEmotions className="h-6 w-6" />
            </Button>
          </div>

          {/* Textarea container with Controller */}
          <div className="flex-1 relative">
            <Controller
              name="message"
              control={control}
              rules={{
                validate: (value) => {
                  // Optional: Add validation rules
                  if (value && value.length > 4096) {
                    return "Message is too long (max 4096 characters)";
                  }
                  return true;
                },
              }}
              render={({ field: { onChange, value, ...field } }) => (
                <Textarea
                  {...field}
                  ref={textareaRef}
                  value={value || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Update form value
                    onChange(newValue);
                    // Handle typing activity
                    handleTypingActivity(newValue);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  disabled={isSending}
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none border-none focus:ring-0 focus-visible:ring-0 text-sm leading-6 min-h-[40px] max-h-[150px] overflow-y-auto scrollbar-custom py-2 px-3 rounded-lg"
                />
              )}
            />
            {/* Error display */}
            {errors.message && (
              <p className="text-red-400 text-xs mt-1 absolute -bottom-5 left-0">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Send button */}
          <Button
            type="submit"
            disabled={!messageValue?.trim() || isSending}
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
      </form>

      {/* Typing indicator (optional) */}
      {isTyping && (
        <div className="absolute -top-6 left-4 text-xs text-gray-400">
          Typing...
        </div>
      )}
    </div>
  );
};

export default MessageInput;
