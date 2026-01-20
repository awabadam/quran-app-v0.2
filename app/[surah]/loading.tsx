import { SurahHeaderSkeleton, VerseSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="relative min-h-screen pt-20">
      <div className="flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          {/* Surah Header Skeleton */}
          <div className="mt-4">
            <SurahHeaderSkeleton />
          </div>
          
          {/* Bismillah Skeleton */}
          <div className="mt-8 flex justify-center">
            <div className="h-16 w-64 bg-gray-800/50 rounded-xl animate-pulse" />
          </div>
          
          {/* Verses Skeleton */}
          <div className="mt-8 mb-12">
            <VerseSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
