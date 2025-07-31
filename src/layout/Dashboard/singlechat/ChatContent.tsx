import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageCard from "./MessageCard";

// Demo messages data
const messages = [
  {
    id: 1,
    text: "Hey there! How are you doing?",
    time: "2:25 PM",
    sender: "John Doe",
    avatar: "/avatars/john.jpg",
    isOwn: false,
    isRead: true,
    isDelivered: true,
  },
  {
    id: 2,
    text: "I'm doing great! Just working on some new projects. How about you?",
    time: "2:27 PM",
    sender: "Me",
    avatar: "/avatars/me.jpg",
    isOwn: true,
    isRead: true,
    isDelivered: true,
  },
  {
    id: 3,
    text: "That sounds awesome! I'd love to hear more about it.",
    time: "2:28 PM",
    sender: "John Doe",
    avatar: "/avatars/john.jpg",
    isOwn: false,
    isRead: true,
    isDelivered: true,
  },
  {
    id: 4,
    text: "Sure! Let's catch up over coffee sometime this week?",
    time: "2:30 PM",
    sender: "Me",
    avatar: "/avatars/me.jpg",
    isOwn: true,
    isRead: false,
    isDelivered: true,
  },
];

const ChatContent = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <ScrollArea className="flex-1 p-4 bg-[#0b141a]">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageCard key={message.id} {...message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatContent;
