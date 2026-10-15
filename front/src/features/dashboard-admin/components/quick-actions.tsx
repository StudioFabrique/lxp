import { EllipsisVertical } from "lucide-react";
import { useContext } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import { AuthContext } from "../../../store/AuthProvider";
import { isTeacherUser } from "../../../utils/helpers/user-role";
import { useIsMobile } from "../../../hooks/useMediaQuery";
import { useMobileHeaderActions } from "../../../hooks/useMobileHeaderActions";

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
  // Mobile : l'en-tête de page est remplacé par le tiroir d'actions de la barre, qui est déjà le menu :
  // les entrées s'y affichent directement, sans second bouton déroulant. Elles y sont déposées ici même,
  // car ce composant n'est pas toujours rendu par l'en-tête de page (accueil administrateur : liste des parcours).
  const isMobile = useIsMobile();
  const headerActions = useMobileHeaderActions();
  const isInActionsDrawer = isMobile && headerActions !== null;

  const items = (
    <>
      <PermissionGuard action="write" object="formation">
        <li>
          <button
            type="button"
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
    </>
  );

  if (isInActionsDrawer) {
    return headerActions.container
      ? createPortal(
          <ul className="menu w-full gap-1 p-0 text-base" aria-label="Actions rapides">
            {items}
          </ul>,
          headerActions.container,
        )
      : null;
  }

  return (
    <details data-chatbot-target="quick-actions" className="dropdown dropdown-end shrink-0 ml-auto">
      <summary className="btn flex gap-2 items-center">
        <span>Actions rapides</span>
        <EllipsisVertical className="w-4 h-4" />
      </summary>
      <ul className="menu dropdown-content theme-tinted-dropdown rounded-box z-20 w-52 border p-2 shadow-lg">
        {items}
      </ul>
    </details>
  );
}
