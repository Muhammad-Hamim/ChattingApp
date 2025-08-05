import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/config/firebase";
import type { TMessage } from "@/types/message";
import { Check, CheckCheck } from "lucide-react";
import moment from "moment";

const MessageCard = (message: TMessage) => {
  const user = auth.currentUser;
  const { sender, content, createdAt } = message;
  const isOwn = user?.uid === sender.uid;
  const isRead = message.status === "read";
  const isDelivered = message.status === "delivered";

  return (
    <div
      className={`flex items-end mb-3 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-end space-x-2 max-w-[70%] ${
          isOwn ? "flex-row-reverse space-x-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage
            src=""
            alt={isOwn ? (user?.displayName as string) : sender.name}
          />
          <AvatarFallback className="bg-[#54656f] text-white text-xs">
            {isOwn
              ? (user?.displayName as string)?.charAt(0).toUpperCase() || "U"
              : sender.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Message bubble */}
        <div
          className={`px-3 py-2 rounded-2xl shadow-sm ${
            isOwn
              ? "bg-[#144d37] text-white rounded-br-md"
              : "bg-[#242626] text-white rounded-bl-md"
          }`}
        >
          {/* Sender name for incoming messages */}
          {/* {!isOwn && (
            <p className="text-xs text-[#00a884] font-medium mb-1 opacity-90">
              {sender.name}
            </p>
          )} */}

          {/* Message content */}
          <p className="text-sm leading-5 break-words">{content}</p>

          {/* Message footer with time and status */}
          <div
            className={`flex items-center justify-end space-x-1 mt-1 ${
              isOwn ? "text-[#aebac1]" : "text-[#8696a0]"
            }`}
          >
            <span className="text-xs opacity-70">
              {moment(createdAt).format("LT")}
            </span>
            {isOwn && (
              <div className="flex items-center">
                {isRead ? (
                  <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
                ) : isDelivered ? (
                  <CheckCheck className="h-3 w-3 text-[#aebac1]" />
                ) : (
                  <Check className="h-3 w-3 text-[#aebac1]" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
