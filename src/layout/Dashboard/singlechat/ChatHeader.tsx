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

interface ChatHeaderProps {
  name: string;
  avatar?: string;
  online?: boolean;
  lastSeen?: string;
}

const ChatHeader = ({ name, avatar, online, lastSeen }: ChatHeaderProps) => {
  return (
    <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#3c464e]">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-[#54656f] text-white">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {online && (
            <div className="absolute bottom-0 right-1 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#202c33]"></div>
          )}
        </div>
        <div>
          <h2 className="text-white font-medium">{name}</h2>
          <p className="text-[#aebac1] text-sm">
            {online ? "online" : lastSeen ? `last seen ${lastSeen}` : "offline"}
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
