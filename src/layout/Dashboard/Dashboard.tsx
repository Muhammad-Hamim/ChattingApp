import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import SideBar from "./sidebar/SideBar";
import ChatLists from "./chatlists/ChatLists";
import SingleChat from "./singlechat/SingleChat";

const Dashboard = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-[#0b141a] flex">
      {/* Desktop Layout - Proper WhatsApp Web Style */}
      <div className="hidden lg:flex w-full">
        <SideBar />
        <div className="flex flex-1 min-w-0">
          <ChatLists
            selectedChat={selectedChat}
            onChatSelect={setSelectedChat}
          />
          <SingleChat selectedChat={selectedChat} />
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:flex lg:hidden w-full">
        <ChatLists selectedChat={selectedChat} onChatSelect={setSelectedChat} />
        <SingleChat selectedChat={selectedChat} />
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
            <ChatLists
              selectedChat={selectedChat}
              onChatSelect={setSelectedChat}
              onAvatarClick={() => setSidebarOpen(true)}
            />
          </div>
        ) : (
          /* Mobile Single Chat */
          <SingleChat
            selectedChat={selectedChat}
            onBack={() => setSelectedChat(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
