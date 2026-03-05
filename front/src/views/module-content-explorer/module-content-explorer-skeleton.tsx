const ModuleContentExplorerSkeleton = () => {
  return (
    <div className="px-8 p-4">
      {/* Header Skeleton */}
      <div className="w-full h-48 relative skeleton bg-base-200 rounded-lg">
        <div className="absolute bottom-5 left-5 space-y-2">
          <div className="h-4 w-32 skeleton bg-base-300" />
          <div className="h-6 w-64 skeleton bg-base-300" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mt-5 max-xl:flex max-xl:flex-col-reverse xl:grid xl:grid-cols-4 gap-5 w-full">
        {/* Progression Side Skeleton */}
        <div className="w-full h-[600px] skeleton bg-base-200 rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <div className="h-6 w-28 skeleton bg-base-300" />
            <div className="h-12 w-12 rounded-full skeleton bg-base-300" />
          </div>
          {/* Course Items Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-24 w-full skeleton bg-base-300 rounded-lg" />
                <div className="h-2 w-full skeleton bg-base-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-5 xl:col-span-3">
          {/* Progress Bar Skeleton */}
          <div className="h-20 w-full skeleton bg-base-200 rounded-lg" />

          {/* Content Area Skeleton */}
          <div className="space-y-4">
            {/* Activity Skeletons */}
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 w-full skeleton bg-base-200 rounded-lg p-4"
              >
                <div className="space-y-4">
                  <div className="h-4 w-3/4 skeleton bg-base-300" />
                  <div className="h-4 w-1/2 skeleton bg-base-300" />
                  <div className="h-4 w-2/3 skeleton bg-base-300" />
                </div>
              </div>
            ))}

            {/* Bottom Buttons Skeleton */}
            <div className="flex justify-end gap-5">
              <div className="h-10 w-32 skeleton bg-base-200 rounded-lg" />
              <div className="h-10 w-32 skeleton bg-base-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ActivitySkeleton = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="w-full h-48 bg-base-200 rounded-lg p-4">
        <div className="space-y-4">
          <div className="h-4 w-3/4 bg-base-300 rounded-sm" />
          <div className="h-4 w-1/2 bg-base-300 rounded-sm" />
          <div className="h-4 w-2/3 bg-base-300 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default ModuleContentExplorerSkeleton;
