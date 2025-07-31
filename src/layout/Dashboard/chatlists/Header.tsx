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
  MoreVertical,
  Users,
  MessageSquare,
  UserPlus,
  Archive,
  Settings,
  Info,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import type { RootState } from "@/redux/store";

interface HeaderProps {
  onAvatarClick?: () => void;
}

const Header = ({ onAvatarClick }: HeaderProps) => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  return (
    <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#3c464e]">
      <div className="flex items-center space-x-3">
        <Avatar
          className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onAvatarClick}
        >
          <AvatarImage
            src={user?.photoURL || undefined}
            alt={user?.displayName || user?.email || "User"}
          />
          <AvatarFallback className="bg-[#54656f] text-white text-xs">
            {(user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-white font-medium">Chats</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <Users className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
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
              New group
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#3c464e] focus:bg-[#3c464e]">
              <Archive className="h-4 w-4 mr-2" />
              Archived
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3c464e]" />
            <DropdownMenuItem className="text-white hover:bg-[#3c464e] focus:bg-[#3c464e]">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#3c464e] focus:bg-[#3c464e]">
              <Info className="h-4 w-4 mr-2" />
              WhatsApp Web
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
