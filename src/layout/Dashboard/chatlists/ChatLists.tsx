import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "./Header";
import SearchBar from "./SearchBar";
import ChatFilter from "./ChatFilter";
import ChatCard from "./ChatCard";
import { useGetAllConversationsQuery } from "@/redux/conversations/conversationsApi";
import ChatListSkeleton from "@/components/loadingSkeleton/ChatListSkeleton";

interface ChatListsProps {
  onAvatarClick?: () => void;
}

const ChatLists = ({ onAvatarClick }: ChatListsProps) => {
  const {
    data: conversations,
    isLoading,
    error,
  } = useGetAllConversationsQuery(undefined);


  return (
    <div className="w-full md:w-80 lg:w-96 bg-[#111b21] border-r border-[#3c464e] flex flex-col h-full">
      <Header onAvatarClick={onAvatarClick} />
      <SearchBar />
      <ChatFilter />

      <ScrollArea className="flex-1 h-0">
        <div className="flex flex-col">
          {isLoading ? (
            <>
              {Array.from({ length: 12 }, (_, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-[#202c33]/30 animate-pulse"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <ChatListSkeleton />
                </div>
              ))}
            </>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-32 text-orange-400 px-4">
              <div className="text-sm text-center mb-2">API Error</div>
              <div className="text-xs text-[#aebac1] text-center">
                {error && typeof error === "object" && "status" in error
                  ? `Status: ${error.status}`
                  : "Check console for details"}
              </div>
            </div>
          ) : conversations && conversations.data.length > 0 ? (
            <>
              {conversations.data.map((conversation) => (
                <ChatCard key={conversation._id} {...conversation} />
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-[#aebac1]">
              No conversations yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatLists;
