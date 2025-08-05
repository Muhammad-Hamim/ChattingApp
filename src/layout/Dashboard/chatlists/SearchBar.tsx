import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="bg-[#161717] px-4 py-3 border-b border-[#3c464e]">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aebac1] h-4 w-4" />
        <Input
          type="text"
          placeholder="Search or start new chat"
          className="pl-10 rounded-full bg-[#2e2f2f] border-[#3c464e] text-white placeholder-[#aebac1] focus:border-[#00a884] focus-visible:ring-0"
        />
      </div>
    </div>
  );
};

export default SearchBar;
