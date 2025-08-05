// ✅ UPDATED ChatHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  Video,
  MoreVertical,
  Search,
  UserPlus,
  Archive,
  Trash2,
  Shield,
  Ban,
} from "lucide-react";
import moment from "moment";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { socket } from "@/socket/socket";
import { auth } from "@/config/firebase";

// User type
export type TUser = {
  uid: string;
  name: string;
  email: string;
  status: "online" | "offline";
  lastSeen: Date;
  conversationId: string;
};

const ChatHeader = () => {
  const { conversationId } = useParams();
  const [currentUser, setCurrentUser] = useState<TUser | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    // Join conversation room
    socket.emit("join-conversation", { conversationId });

    // Listen to user-status-changed
    const handleUserStatusChanged = (userData: TUser) => {
      if (
        userData.conversationId === conversationId &&
        userData.uid !== auth?.currentUser?.uid // 🔥 Only set the OTHER participant
      ) {
        setCurrentUser(userData);
      }
    };

    socket.on("user-status-changed", handleUserStatusChanged);

    return () => {
      socket.emit("leave-conversation", { conversationId });
      socket.off("user-status-changed", handleUserStatusChanged);
    };
  }, [conversationId]);

  return (
    <div className="bg-[#161717] px-4 py-3 flex items-center justify-between border-b border-[#3c464e]">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={currentUser?.name} />
            <AvatarFallback className="bg-[#54656f] text-white">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {currentUser?.status === "online" && (
            <div className="absolute bottom-0 right-1 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#161717] animate-pulse"></div>
          )}
        </div>
        <div>
          <h2 className="text-white font-medium">{currentUser?.name}</h2>
          <p className="text-[#aebac1] text-sm">
            {currentUser?.status === "online" ? (
              <span className="text-[#00a884]">online</span>
            ) : currentUser?.lastSeen ? (
              `last seen ${moment(currentUser.lastSeen).fromNow()}`
            ) : (
              "offline"
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <Video className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <Search className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#202c33] border-[#3c464e] text-white"
          >
            <DropdownMenuItem className="text-white hover:bg-[#3c464e] focus:bg-[#3c464e]">
              <UserPlus className="h-4 w-4 mr-2" />
              Add to group
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#3c464e] focus:bg-[#3c464e]">
              <Archive className="h-4 w-4 mr-2" />
              Archive chat
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#3c464e] focus:bg-[#3c464e]">
              <Shield className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3c464e]" />
            <DropdownMenuItem className="text-white hover:bg-[#3c464e] focus:bg-[#3c464e]">
              <Ban className="h-4 w-4 mr-2" />
              Block
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-[#3c464e] focus:bg-[#3c464e] focus:text-red-300">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
