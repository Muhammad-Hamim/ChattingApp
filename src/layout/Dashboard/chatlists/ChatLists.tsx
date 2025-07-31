import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "./Header";
import SearchBar from "./SearchBar";
import ChatFilter from "./ChatFilter";
import ChatCard from "./ChatCard";

// Demo conversation data
const conversations = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, how are you doing?",
    time: "2:30 PM",
    unread: 2,
    avatar: "/avatars/john.jpg",
    online: true,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    lastMessage: "Can we schedule a meeting tomorrow?",
    time: "1:15 PM",
    unread: 0,
    avatar: "/avatars/sarah.jpg",
    online: false,
  },
  {
    id: 3,
    name: "Team Group",
    lastMessage: "Alice: Great work everyone! 👏",
    time: "12:45 PM",
    unread: 5,
    avatar: "/avatars/team.jpg",
    online: false,
    isGroup: true,
  },
  {
    id: 4,
    name: "Mike Johnson",
    lastMessage: "Thanks for the help earlier",
    time: "11:30 AM",
    unread: 0,
    avatar: "/avatars/mike.jpg",
    online: true,
  },
  {
    id: 5,
    name: "Emma Davis",
    lastMessage: "See you at the conference!",
    time: "10:20 AM",
    unread: 1,
    avatar: "/avatars/emma.jpg",
    online: false,
  },
];

interface ChatListsProps {
  selectedChat: number | null;
  onChatSelect: (chatId: number) => void;
  onAvatarClick?: () => void;
}

const ChatLists = ({
  selectedChat,
  onChatSelect,
  onAvatarClick,
}: ChatListsProps) => {
  return (
    <div className="w-full md:w-80 lg:w-96 bg-[#111b21] border-r border-[#3c464e] flex flex-col h-full">
      <Header onAvatarClick={onAvatarClick} />
      <SearchBar />
      <ChatFilter />

      <ScrollArea className="flex-1">
        {conversations.map((conversation) => (
          <ChatCard
            key={conversation.id}
            {...conversation}
            isSelected={selectedChat === conversation.id}
            onClick={() => onChatSelect(conversation.id)}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

export default ChatLists;
