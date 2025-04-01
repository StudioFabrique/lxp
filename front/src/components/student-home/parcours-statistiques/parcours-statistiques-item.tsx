type ParcoursStatistiquesItemProps = {
  title: string;
  value: string;
};

const ParcoursStatistiquesItem = ({
  title,
  value,
}: ParcoursStatistiquesItemProps) => {
  return (
    <div
      className="flex flex-col justify-center items-center bg-secondary/10 text-primary rounded-lg px-2 tooltip"
      data-tip={value}
    >
      <p className="text-sm font-light">{title}</p>
      <p className="w-24 font-bold truncate text-center">{value}</p>
    </div>
  );
};

export default ParcoursStatistiquesItem;
