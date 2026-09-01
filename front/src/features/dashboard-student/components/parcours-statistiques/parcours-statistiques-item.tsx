type ParcoursStatistiquesItemProps = {
  title: string;
  value: string;
};

const ParcoursStatistiquesItem = ({
  title,
  value,
}: ParcoursStatistiquesItemProps) => {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center rounded-lg bg-secondary/10 px-2 py-2 text-primary">
      <p className="text-sm font-light">{title}</p>
      <p className="w-full truncate text-center font-bold">{value}</p>
    </div>
  );
};

export default ParcoursStatistiquesItem;
