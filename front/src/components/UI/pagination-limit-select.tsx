type Props = {
  perPage?: number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

function PaginationLimitSelect({ perPage, onChange }: Props) {
  return (
    <>
      <p>Nombre d'éléments par page</p>
      <select
        className="select select-bordered select-sm focus:outline-none"
        onChange={onChange}
        value={perPage}
      >
        <option>6</option>
        <option>12</option>
        <option>24</option>
      </select>
    </>
  );
}

export default PaginationLimitSelect;
