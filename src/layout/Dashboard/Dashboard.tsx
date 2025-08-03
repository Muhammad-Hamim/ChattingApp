import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import SideBar from "./sidebar/SideBar";
import ChatLists from "./chatlists/ChatLists";
import SingleChat from "./singlechat/SingleChat";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentConversation } from "@/redux/conversations/conversationsSlice";
import { useParams, useNavigate } from "react-router";
import WelcomeText from "@/layout/Dashboard/singlechat/WelcomeText";
import { Toaster } from "@/components/ui/sonner";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedChat = useAppSelector(
    (state) => state.conversations.currentConversation?._id
  );
  const { conversationId } = useParams<{ conversationId: string }>();

  // Sync URL params with Redux state
  useEffect(() => {
    if (conversationId) {
      dispatch(setCurrentConversation(conversationId));
    } else {
      dispatch(setCurrentConversation(null));
    }
  }, [conversationId, dispatch]);

  const handleBackToChats = () => {
    dispatch(setCurrentConversation(null));
    navigate("/dashboard");
  };

  return (
    <>
      <Toaster />
      <div className="h-screen bg-[#0b141a] flex">
        {/* Desktop Layout - Proper WhatsApp Web Style */}
        <div className="hidden lg:flex w-full">
          <SideBar />
          <div className="flex flex-1 min-w-0">
            <ChatLists />
            {conversationId ? <SingleChat /> : <WelcomeText />}
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:flex lg:hidden w-full">
          <ChatLists />
          {conversationId ? <SingleChat /> : <WelcomeText />}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex w-full">
          {!selectedChat ? (
            <div className="flex w-full">
              {/* Mobile Sidebar Drawer */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent
                  side="left"
                  className="w-16 p-0 bg-[#202c33] border-r border-[#3c464e]"
                >
                  <SideBar />
                </SheetContent>
              </Sheet>

              {/* Mobile Chat List */}
              <ChatLists onAvatarClick={() => setSidebarOpen(true)} />
            </div>
          ) : (
            /* Mobile Single Chat */
            <SingleChat onBack={handleBackToChats} />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
