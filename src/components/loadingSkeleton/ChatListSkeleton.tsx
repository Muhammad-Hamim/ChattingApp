import { Skeleton } from "@/components/ui/skeleton";

const ChatListSkeleton = () => {
  return (
    <div className="flex items-center space-x-3 hover:bg-[#202c33] transition-colors">
      {/* Avatar skeleton */}
      <Skeleton className="h-12 w-12 rounded-full bg-[#3c464e]" />

      <div className="flex-1 space-y-2">
        {/* Name and time row */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32 bg-[#3c464e]" />
          <Skeleton className="h-3 w-12 bg-[#3c464e]" />
        </div>

        {/* Last message row */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-48 bg-[#3c464e]" />
          <Skeleton className="h-5 w-5 rounded-full bg-[#00a884]" />
        </div>
      </div>
    </div>
  );
};

export default ChatListSkeleton;
