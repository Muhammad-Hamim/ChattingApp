import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageCircle,
  Users,
  Archive,
  Star,
  Settings,
  LogOut,
  MoreVertical,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser } from "@/services/authService";
import { clearAuth } from "@/redux/auth/authSlice";
import { useNavigate } from "react-router";
import type { RootState } from "@/redux/store";

const SideBar = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearAuth());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-16 bg-[#1d1f1f] border-r border-[#3c464e] flex flex-col items-center py-4 space-y-4">
      {/* User Profile */}
      <div className="relative">
        <Avatar className="h-10 w-10 border-2 border-[#3c464e]">
          <AvatarImage
            src=""
            alt={user?.name as string}
          />
          <AvatarFallback className="bg-[#54656f] text-white text-sm">
            {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-1 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#202c33]"></div>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col space-y-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 hover:text-white hover:bg-[#3c464e] bg-[#00a884] text-white"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <Users className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <Archive className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <Star className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1"></div>

      {/* Bottom Icons */}
      <div className="flex flex-col space-y-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <Settings className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#202c33] border-[#3c464e] text-white"
          >
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-[#3c464e] focus:bg-[#3c464e] focus:text-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SideBar;
