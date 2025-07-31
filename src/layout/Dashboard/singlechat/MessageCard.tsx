import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck } from "lucide-react";

interface MessageCardProps {
  id: number;
  text: string;
  time: string;
  sender: string;
  avatar?: string;
  isOwn: boolean;
  isRead?: boolean;
  isDelivered?: boolean;
}

const MessageCard = ({
  text,
  time,
  sender,
  avatar,
  isOwn,
  isRead,
  isDelivered,
}: MessageCardProps) => {
  return (
    <div
      className={`flex items-end space-x-2 mb-4 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={sender} />
          <AvatarFallback className="bg-[#54656f] text-white text-xs">
            {sender.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn ? "bg-[#005c4b] text-white" : "bg-[#202c33] text-white"
        }`}
      >
        <p className="text-sm">{text}</p>
        <div
          className={`flex items-center justify-end space-x-1 mt-1 ${
            isOwn ? "text-[#aebac1]" : "text-[#aebac1]"
          }`}
        >
          <span className="text-xs">{time}</span>
          {isOwn && (
            <div className="flex">
              {isRead ? (
                <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
              ) : isDelivered ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </div>
          )}
        </div>
      </div>

      {isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={sender} />
          <AvatarFallback className="bg-[#54656f] text-white text-xs">
            {sender.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageCard;
