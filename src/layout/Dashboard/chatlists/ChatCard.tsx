import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { setCurrentConversation } from "@/redux/conversations/conversationsSlice";
import moment from "moment";
import gravatarUrl from "gravatar-url";
import { useNavigate } from "react-router";
import { MdInsertPhoto } from "react-icons/md";

export type TConversation = {
  _id: string;
  type: "DM" | "GROUP";
  status: "pending" | "accepted" | "rejected";
  participants?: {
    name: string;
    email: string;
  };
  blocked_details?: {
    status: "blocked" | "unblocked";
    blockedBy: string;
  };
  lastMessage?: {
    _id: string;
    sender_name: string;
    sender_email: string;
    type: "text" | "image";
    content: string;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};
const ChatCard = (conversation: TConversation) => {
  const { participants, lastMessage, type, updatedAt } = conversation;
  const { currentConversation } = useAppSelector(
    (state) => state.conversations
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [online] = useState(true);
  const handleOpenConversation = () => {
    dispatch(setCurrentConversation(conversation));
    navigate(`/dashboard/chat/${conversation._id}`);
  };
  return (
    <div
      className={`flex items-center space-x-3 p-3 hover:bg-[#202c33] cursor-pointer transition-colors ${
        (currentConversation?._id as string) === conversation._id
          ? "bg-[#202c33]"
          : ""
      }`}
      onClick={handleOpenConversation}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={gravatarUrl(participants?.email as string)}
            alt={participants?.name}
          />
          <AvatarFallback className="bg-[#54656f] text-white">
            {participants?.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {online && type !== "GROUP" && (
          <div className="absolute bottom-0 right-1 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#111b21]"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium truncate">
            {participants?.name}
          </h3>
          <span className="text-[#aebac1] text-xs">
            {moment(updatedAt).fromNow()}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[#aebac1] text-sm truncate flex-1 mr-2">
            {lastMessage ? (
              lastMessage.type === "text" ? (
                <span className="truncate block">{lastMessage.content}</span>
              ) : lastMessage.type === "image" ? (
                <span className="flex items-center">
                  <MdInsertPhoto className="mr-1" />
                  Photo
                </span>
              ) : (
                "No last message found"
              )
            ) : (
              "No last message found"
            )}
          </p>
          {/* {unread > 0 && (
            <Badge className="bg-[#00a884] text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
              {unread}
            </Badge>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
