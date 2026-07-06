type QuickStatItemProps = {
  title: string;
  item: string | number;
};

const QuickStatItem = ({ title, item }: QuickStatItemProps) => (
  <div className="card bg-base-200 border border-base-300 w-full h-24 flex flex-col justify-center items-center text-base-content transition-colors hover:bg-base-300">
    <div className="card-body justify-center text-center flex flex-col gap-1">
      <h2 className="text-sm font-semibold opacity-70 uppercase tracking-wide">
        {title}
      </h2>
      <p className="text-2xl font-bold text-primary">{item}</p>
    </div>
  </div>
);

export default QuickStatItem;
