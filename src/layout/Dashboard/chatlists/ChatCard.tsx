import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ChatCardProps {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
  online?: boolean;
  isGroup?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const ChatCard = ({
  name,
  lastMessage,
  time,
  unread,
  avatar,
  online,
  isGroup,
  isSelected,
  onClick,
}: ChatCardProps) => {
  return (
    <div
      className={`flex items-center space-x-3 p-3 hover:bg-[#202c33] cursor-pointer transition-colors ${
        isSelected ? "bg-[#202c33]" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-[#54656f] text-white">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {online && !isGroup && (
          <div className="absolute bottom-0 right-1 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#111b21]"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium truncate">{name}</h3>
          <span className="text-[#aebac1] text-xs">{time}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[#aebac1] text-sm truncate">{lastMessage}</p>
          {unread > 0 && (
            <Badge className="bg-[#00a884] text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
              {unread}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
