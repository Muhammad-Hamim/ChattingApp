import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const ChatLoader = () => {
  return (
    <ScrollArea className="h-full w-full scrollbar-custom">
      <div className="p-4 min-h-full flex flex-col space-y-4">
        {/* Left-aligned message skeletons */}
        <div className="flex items-end">
          <div className="flex flex-col space-y-2 max-w-[70%]">
            <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
            <div className="bg-[#202c33] p-3 rounded-lg">
              <Skeleton className="h-4 w-32 mb-2" /> {/* Short text */}
              <Skeleton className="h-4 w-48" /> {/* Longer text */}
            </div>
            <Skeleton className="h-3 w-16" /> {/* Timestamp */}
          </div>
        </div>

        {/* Right-aligned message skeleton */}
        <div className="flex items-end justify-end">
          <div className="flex flex-col items-end space-y-2 max-w-[70%]">
            <div className="bg-[#005c4b] p-3 rounded-lg">
              <Skeleton className="h-4 w-40 mb-2" /> {/* Medium text */}
              <Skeleton className="h-4 w-28" /> {/* Shorter text */}
            </div>
            <Skeleton className="h-3 w-16" /> {/* Timestamp */}
          </div>
        </div>

        {/* Left-aligned message skeleton */}
        <div className="flex items-end">
          <div className="flex flex-col space-y-2 max-w-[70%]">
            <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
            <div className="bg-[#202c33] p-3 rounded-lg">
              <Skeleton className="h-4 w-24" /> {/* Short text */}
            </div>
            <Skeleton className="h-3 w-16" /> {/* Timestamp */}
          </div>
        </div>

        {/* Right-aligned message skeleton */}
        <div className="flex items-end justify-end">
          <div className="flex flex-col items-end space-y-2 max-w-[70%]">
            <div className="bg-[#005c4b] p-3 rounded-lg">
              <Skeleton className="h-4 w-52 mb-2" /> {/* Long text */}
              <Skeleton className="h-4 w-44 mb-2" /> {/* Medium text */}
              <Skeleton className="h-4 w-36" /> {/* Shorter text */}
            </div>
            <Skeleton className="h-3 w-16" /> {/* Timestamp */}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ChatLoader;
