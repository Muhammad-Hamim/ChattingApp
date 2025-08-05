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
    <div className="flex-1 flex flex-col h-full relative bg-[#161717] overflow-hidden">
      {/* Mobile Back Button - Fixed at top */}
      {onBack && (
        <div className="md:hidden bg-[#202c33] px-4 py-3 border-b border-[#3c464e] flex items-center flex-shrink-0">
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

      {/* Chat Header - Fixed at top */}
      <div className="flex-shrink-0">
        <ChatHeader />
      </div>

      {/* Chat Content - Scrollable area that takes remaining space */}
      <div className="flex-1 overflow-hidden ">
        <ChatContent />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="flex-shrink-0 absolute bottom-5 left-1/2 -translate-x-1/2 w-[95%] px-6">
        <MessageInput />
      </div>
    </div>
  );
};

export default SingleChat;
