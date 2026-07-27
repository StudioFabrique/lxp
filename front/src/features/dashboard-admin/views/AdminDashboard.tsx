import { useContext } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { dashboardAdminApi } from "../api/dashboard-admin.api";
import { AuthContext } from "../../../store/AuthProvider";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import TeacherLastParcours from "../components/teacher-last-parcours";
import LastParcours from "../components/last-parcours";
import LastFeedback from "../components/last-feedback";
import TeacherLessonsQualityStats from "../components/teacher-lessons-quality-stats/teacher-lessons-quality-stats";
import LastModules from "../components/last-modules";
import SidebarRouteIcon from "../../../components/headers/SidebarRouteIcon";

// Structure des liens centralisée avec métadonnées de permission optionnelles
const links = [
  {
    path: "/admin/formation",
    label: "Créer une formation",
    permission: { action: "write", object: "formation" },
  },
  {
    path: "/admin/parcours/new",
    label: "Créer un parcours",
    permission: { action: "write", object: "parcours" },
  },
  { path: "/admin/user/add", label: "Créer un utilisateur" },
  { path: "/admin/feedbacks", label: "Voir les feedbacks" },
  { path: "/admin/teacher/evaluations", label: "Evaluer un apprenant" },
];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { data: parcours, isLoading } = useQuery({
    queryKey: ["last-parcours"],
    queryFn: dashboardAdminApi.queries.getLastParcours,
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* --- Bannière de bienvenue --- */}
      <section className="bg-base-200 border border-base-300 rounded-lg p-6 shadow-sm w-full">
        <h2 className="flex items-center gap-3 text-3xl font-extrabold capitalize text-primary mb-2">
          <SidebarRouteIcon />
          <span>
            Bonjour, {user?.firstname} {user?.lastname} !
          </span>
        </h2>
        <p className="text-base-content opacity-80 max-w-3xl">
          Bienvenue dans votre panneau d'administration, l'outil central pour
          gérer et surveiller tous les aspects de l'apprentissage de vos
          apprenants.
        </p>
      </section>

      {/* --- Boutons d'actions rapides (Optimisés et Sécurisés) --- */}
      <section>
        <ul className="flex flex-wrap items-center gap-3">
          {links.map((item) => {
            const content = (
              <li>
                <Link
                  className="btn btn-outline border-base-300 bg-base-100 hover:bg-base-200 hover:border-primary shadow-sm"
                  to={item.path}
                >
                  {item.label}
                </Link>
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

            return <span key={item.label}>{content}</span>;
          })}
        </ul>
      </section>

      {/* --- Contenu Principal --- */}
      <section className="w-full flex flex-col 2xl:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <article className="w-full flex flex-col gap-y-4">
            {user?.roles.find((role) => role.role === "teacher") &&
            parcours &&
            parcours.length > 0 ? (
              <TeacherLastParcours parcours={parcours} isLoading={isLoading} />
            ) : null}
            <LastParcours />
            <LastModules />
          </article>

          <article className="w-full flex flex-col xl:flex-row gap-6">
            <PermissionGuard action="component" object="last-feedback">
              <LastFeedback />
            </PermissionGuard>
            <PermissionGuard action="component" object="lessons-rating-stats">
              <TeacherLessonsQualityStats />
            </PermissionGuard>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
