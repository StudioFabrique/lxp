type TableHeadProps = {
  labels: string[];
};

const GenericTableHead = (props: TableHeadProps) => {
  return (
    <thead>
      {props.labels.map((label) => (
        <th>{label}</th>
      ))}
    </thead>
  );
};

export default GenericTableHead;
