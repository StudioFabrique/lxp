type QuickStatItemProps = {
  title: string;
  item: string | number;
};

const QuickStatItem = ({ title, item }: QuickStatItemProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-base-200 border border-base-300 p-4 rounded-lg text-base-content shadow-sm gap-2 px-4 w-full">
      <p className="font-bold text-base-content">{item}</p>
      <p className="text-xs opacity-70">{title}</p>
    </div>
  );
};

export default QuickStatItem;
