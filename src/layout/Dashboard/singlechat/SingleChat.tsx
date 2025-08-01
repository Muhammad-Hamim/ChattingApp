import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import MessageInput from "./MessageInput";

interface SingleChatProps {
  onBack?: () => void;
}

const SingleChat = ({ onBack }: SingleChatProps) => {
  
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b141a]">
      {/* Mobile Back Button */}
      {onBack && (
        <div className="md:hidden bg-[#202c33] px-4 py-3 border-b border-[#3c464e] flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 text-[#aebac1] hover:text-white hover:bg-[#3c464e] mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-white font-medium">Back to Chats</h2>
        </div>
      )}

      <ChatHeader />
      <ChatContent />
      <MessageInput />
    </div>
  );
};

export default SingleChat;
