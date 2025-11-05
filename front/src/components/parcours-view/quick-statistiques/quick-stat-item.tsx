type QuickStatItemProps = {
  title: string;
  item: string | number;
};

const QuickStatItem = ({ title, item }: QuickStatItemProps) => (
  <div className="bg-secondary card w-full h-24 flex flex-col justify-center items-center text-base-100">
    <div className="card-body text-center">
      <h2 className="card-title justify-center text-xl font-bold">{title}</h2>
      <p className="text-lg font-bold">{item}</p>
    </div>
  </div>
);

export default QuickStatItem;
