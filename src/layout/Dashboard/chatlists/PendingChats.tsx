import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";

interface PendingChatProps {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar?: string;
}

const PendingChats = () => {
  // Demo pending chats data
  const pendingChats: PendingChatProps[] = [
    {
      id: 1,
      name: "Alex Johnson",
      message: "Hey! Would love to connect.",
      time: "5 min ago",
      avatar: "/avatars/alex.jpg",
    },
    {
      id: 2,
      name: "Maria Garcia",
      message: "Hi there! Found your profile interesting.",
      time: "1 hour ago",
      avatar: "/avatars/maria.jpg",
    },
  ];

  const handleAccept = (id: number) => {
    console.log("Accepting chat request:", id);
  };

  const handleReject = (id: number) => {
    console.log("Rejecting chat request:", id);
  };

  if (pendingChats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p className="text-sm">No pending chat requests</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800">
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className="text-white font-medium">Pending Requests</h3>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {pendingChats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-3 border-b border-gray-700/50"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback className="bg-gray-600 text-white text-sm">
                {chat.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 ml-3">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium text-sm">{chat.name}</h4>
                <span className="text-gray-400 text-xs">{chat.time}</span>
              </div>
              <p className="text-gray-400 text-sm truncate">{chat.message}</p>
            </div>

            <div className="flex items-center space-x-2 ml-2">
              <Button
                size="icon"
                onClick={() => handleAccept(chat.id)}
                className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleReject(chat.id)}
                className="h-8 w-8 border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingChats;
