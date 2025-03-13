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
      className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg px-2 tooltip"
      data-tip={value}
    >
      <p className="text-sm">{title}</p>
      <p className="w-24 text-base truncate text-center">{value}</p>
    </div>
  );
};

export default ParcoursStatistiquesItem;
