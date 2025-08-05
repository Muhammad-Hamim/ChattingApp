import { Button } from "@/components/ui/button";

const ChatFilter = () => {
  return (
    <div className="bg-[#161717] px-4 py-2 border-b border-[#3c464e]">
      <div className="flex space-x-2">
        <Button
          variant="secondary"
          size="sm"
          className="bg-[#00a884] text-white hover:bg-[#00a884]/80 border-0"
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          Unread
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          Favorites
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          Groups
        </Button>
      </div>
    </div>
  );
};

export default ChatFilter;
