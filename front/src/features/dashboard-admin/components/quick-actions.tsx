import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router";
import PermissionGuard from "../../../components/guards/PermissionGuard";

const links = [
  {
    path: "/admin/parcours/new",
    label: "Créer un parcours",
    permission: { action: "write", object: "parcours" },
  },
  { path: "/admin/user/add", label: "Créer un utilisateur" },
  { path: "/admin/feedbacks", label: "Voir les feedbacks" },
  { path: "/admin/teacher/evaluations", label: "Evaluer un apprenant" },
];

export default function QuickActions({
  onCreateFormation,
}: {
  onCreateFormation: () => void;
}) {
  return (
    <details className="dropdown dropdown-end shrink-0 ml-auto">
      <summary className="btn flex gap-2 items-center">
        <span className="pb-0.5">Actions rapides</span>
        <EllipsisVertical className="w-4 h-4" />
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        <PermissionGuard action="write" object="formation">
          <li>
            <button
              type="button"
              data-onboarding="formation-create-entry"
              onClick={onCreateFormation}
            >
              Créer une formation
            </button>
          </li>
        </PermissionGuard>
        {links.map((item) => {
          const content = (
            <li>
              <Link to={item.path}>{item.label}</Link>
            </li>
          );

          if (item.permission) {
            return (
              <PermissionGuard
                key={item.label}
                action={item.permission.action}
                object={item.permission.object}
              >
                {content}
              </PermissionGuard>
            );
          }

          return (
            <li key={item.label}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
