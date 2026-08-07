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
import { EllipsisVertical } from "lucide-react";

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
  const isTeacher =
    user?.roles.some((role) => role.role === "teacher") ?? false;

  const { data: teacherParcours = [], isLoading: isTeacherParcoursLoading } =
    useQuery({
      queryKey: ["last-parcours"],
      queryFn: dashboardAdminApi.queries.getLastParcours,
      enabled: isTeacher,
    });

  const { data: formations = [], isSuccess: areFormationsLoaded } = useQuery({
    queryKey: ["dashboard-admin", "last-formations"],
    queryFn: dashboardAdminApi.queries.getLastFormations,
  });

  const {
    data: parcours = [],
    isLoading: isParcoursLoading,
    isSuccess: areParcoursLoaded,
  } = useQuery({
    queryKey: ["root-parcours"],
    queryFn: dashboardAdminApi.queries.getRootParcours,
  });

  const shouldRecommendFormation = areFormationsLoaded && formations.length < 1;
  const shouldRecommendParcours =
    areFormationsLoaded &&
    formations.length > 0 &&
    areParcoursLoaded &&
    parcours.length < 1;

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

      {/* --- Liste d'actions rapides --- */}
      <section className="flex flex-wrap justify-end items-center gap-3">
        {/*{shouldRecommendFormation ? (
          <PermissionGuard action="write" object="formation">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                className="btn btn-xl flex flex-col p-10"
                to="/admin/formation"
              >
                <span className="badge badge-in">Action recommandée</span>
                <span>Créer une formation</span>
              </Link>
            </div>
          </PermissionGuard>
        ) : null}*/}

        {/*{shouldRecommendParcours ? (
          <PermissionGuard action="write" object="parcours">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-primary badge-outline">
                Action recommandée
              </span>
              <Link className="btn btn-primary" to="/admin/parcours/new">
                Créer un parcours
              </Link>
            </div>
          </PermissionGuard>
        ) : null}*/}

        <details className="dropdown">
          <summary className="btn m-1 flex items-center">
            <span className="pb-0.5">Actions rapides</span>
            <EllipsisVertical className="w-4 h-4" />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
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
      </section>

      {/* --- Contenu Principal --- */}
      <section className="w-full flex flex-col 2xl:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <article className="w-full flex flex-col gap-y-4">
            {isTeacher && teacherParcours.length > 0 ? (
              <TeacherLastParcours
                parcours={teacherParcours}
                isLoading={isTeacherParcoursLoading}
              />
            ) : null}
            <LastParcours parcours={parcours} isLoading={isParcoursLoading} />
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
