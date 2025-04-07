type QuickStatItemProps = {
  title: string;
  item: string | number;
};

const QuickStatItem = ({ title, item }: QuickStatItemProps) => (
  <div className="bg-secondary text-secondary-content card w-48 h-32 flex flex-col justify-center items-center">
    <div className="card-body text-center">
      <h2 className="card-title justify-center text-xl font-bold">{title}</h2>
      <p className="text-2xl font-bold">{item}</p>
    </div>
  </div>
);

export default QuickStatItem;
