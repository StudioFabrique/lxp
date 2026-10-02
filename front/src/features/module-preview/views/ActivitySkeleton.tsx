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
