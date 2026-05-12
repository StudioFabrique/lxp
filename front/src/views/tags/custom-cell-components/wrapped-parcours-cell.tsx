import { Link } from "react-router";

export type WrappedParcoursCellProps = {
  data: { id: number; title: string }[];
};

const WrappedParcoursCell = ({ data }: WrappedParcoursCellProps) => {
  return (
    <td className="p-2">
      <div className="flex flex-wrap gap-2">
        {data.length > 0 ? (
          data.map((p) => (
            <Link
              key={p.id}
              to={`/admin/parcours/view/${p.id}`}
              className="badge badge-primary badge-outline p-3 hover:badge-primary transition-colors"
            >
              {p.title}
            </Link>
          ))
        ) : (
          <span className="w-full">-</span>
        )}
      </div>
    </td>
  );
};

export default WrappedParcoursCell;
