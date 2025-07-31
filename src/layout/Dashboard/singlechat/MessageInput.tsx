import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Mic, Send, Smile } from "lucide-react";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[#202c33] px-4 py-3 border-t border-[#3c464e]">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="bg-[#2a3942] border-[#3c464e] text-white placeholder-[#aebac1] pr-10 focus:bg-[#2a3942] focus:border-[#00a884] resize-none min-h-[40px] max-h-[120px]"
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 h-6 w-6 text-[#aebac1] hover:text-white"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {message.trim() ? (
          <Button
            onClick={handleSend}
            size="icon"
            className="h-9 w-9 bg-[#00a884] hover:bg-[#00a884]/80 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
