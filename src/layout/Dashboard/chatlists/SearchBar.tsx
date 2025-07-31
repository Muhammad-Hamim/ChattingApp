import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  return (
    <div className="bg-[#111b21] px-4 py-3 border-b border-[#3c464e]">
      <div className="relative flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aebac1] h-4 w-4" />
          <Input
            type="text"
            placeholder="Search or start new chat"
            className="pl-10 bg-[#202c33] border-[#3c464e] text-white placeholder-[#aebac1] focus:bg-[#202c33] focus:border-[#00a884]"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-[#aebac1] hover:text-white hover:bg-[#3c464e]"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
