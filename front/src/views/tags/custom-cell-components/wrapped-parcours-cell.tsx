import { Link } from "react-router-dom";

export type WrappedParcoursCellProps = {
  data: { id: number; name: string }[];
};

const WrappedParcoursCell = ({ data }: WrappedParcoursCellProps) => {
  return (
    <td className="p-2">
      <div className="flex flex-wrap gap-2">
        {data.map((p) => (
          <Link
            key={p.id}
            to={`/admin/parcours/view/${p.id}`}
            className="badge badge-primary badge-outline p-3 hover:badge-primary transition-colors"
          >
            {p.name}
          </Link>
        ))}
      </div>
    </td>
  );
};

export default WrappedParcoursCell;
