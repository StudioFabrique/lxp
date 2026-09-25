import { EllipsisVertical } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import { AuthContext } from "../../../store/AuthProvider";
import { isTeacherUser } from "../../../utils/helpers/user-role";

const links = [
  { path: "/admin/user/add", label: "Créer un utilisateur" },
  { path: "/admin/feedbacks", label: "Voir les feedbacks" },
  {
    path: "/admin/teacher/evaluations",
    label: "Évaluer un apprenant",
    teacherOnly: true,
  },
];

export default function QuickActions({
  onCreateFormation,
  onCreateParcours,
}: {
  onCreateFormation: () => void;
  onCreateParcours: () => void;
}) {
  const { user } = useContext(AuthContext);

  return (
    <details className="dropdown dropdown-end shrink-0 ml-auto">
      <summary className="btn flex gap-2 items-center">
        <span>Actions rapides</span>
        <EllipsisVertical className="w-4 h-4" />
      </summary>
      <ul className="menu dropdown-content theme-tinted-dropdown rounded-box z-20 w-52 border p-2 shadow-lg">
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
        <PermissionGuard action="write" object="parcours">
          <li>
            <button type="button" onClick={onCreateParcours}>
              Créer un parcours
            </button>
          </li>
        </PermissionGuard>
        {links.map((item) => {
          if (item.teacherOnly && !isTeacherUser(user)) return null;

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
