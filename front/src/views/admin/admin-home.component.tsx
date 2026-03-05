import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeacherLastParcours from "../../components/admin-home/teacher-last-parcours";
import Can from "../../components/UI/can/can.component";
import LastParcours from "../../components/admin-home/last-parcours";
import LastFeedback from "../../components/admin-home/last-feedback";
import useHttp from "../../hooks/use-http";
import Parcours from "../../utils/interfaces/parcours";
import TeacherLessonsQualityStats from "../../components/admin-home/teacher-lessons-quality-stats/teacher-lessons-quality-stats";
import { Context } from "../../store/context.store";

const links = [
  { path: "/admin/formation", label: "Créer une formation" },
  { path: "/admin/parcours/créer-un-parcours", label: "Créer un parcours" },
  { path: "/admin/module/add", label: "Créer un module" },
  { path: "/admin/course/add", label: "Créer un cours" },
  { path: "/admin/lesson/Add", label: "Créer une leçon" },
  { path: "/admin/user/add", label: "Créer un utilisateur" },
  { path: "/admin/feedbacks", label: "Voir les feedbacks" },
  { path: "/admin/teacher/evaluations", label: "Evaluer un apprenant" },
];

const AdminHome = () => {
  const { user } = useContext(Context);
  const { sendRequest, isLoading } = useHttp();
  const [parcours, setParcours] = useState<Parcours[] | null>(null);

  const getParcours = useCallback(() => {
    const applyData = (data: {
      message: string;
      success: boolean;
      response: Parcours[];
    }) => {
      setParcours(data.response);
    };
    sendRequest({ path: "/user/last-parcours" }, applyData);
  }, [sendRequest]);

  useEffect(() => {
    getParcours();
  }, [getParcours]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* --- Bannière de bienvenue --- */}
      <section className="bg-base-200 border border-base-300 rounded-lg p-6 shadow-sm w-full">
        <h2 className="text-3xl font-extrabold capitalize text-primary mb-2">
          Bonjour, {user?.firstname} {user?.lastname} !
        </h2>
        <p className="text-base-content opacity-80 max-w-3xl">
          Bienvenue dans votre panneau d'administration, l'outil central pour
          gérer et surveiller tous les aspects de l'apprentissage de vos
          apprenants.
        </p>
      </section>

      {/* --- Boutons d'actions rapides --- */}
      <section>
        <ul className="flex flex-wrap items-center gap-3">
          <Can action="write" object="formation">
            <li>
              <Link
                className="btn btn-outline border-base-300 bg-base-100 hover:bg-base-200 hover:border-primary shadow-sm"
                to={links[0].path}
              >
                {links[0].label}
              </Link>
            </li>
          </Can>
          <Can action="write" object="parcours">
            <li>
              <Link
                className="btn btn-outline border-base-300 bg-base-100 hover:bg-base-200 hover:border-primary shadow-sm"
                to={links[1].path}
              >
                {links[1].label}
              </Link>
            </li>
          </Can>
          <Can action="write" object="module">
            <li>
              <Link
                className="btn btn-outline border-base-300 bg-base-100 hover:bg-base-200 hover:border-primary shadow-sm"
                to={links[2].path}
              >
                {links[2].label}
              </Link>
            </li>
          </Can>
          {links.map((item, index) =>
            index > 2 ? (
              <li key={item.label}>
                <Link
                  className="btn btn-outline border-base-300 bg-base-100 hover:bg-base-200 hover:border-primary shadow-sm"
                  to={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ) : null,
          )}
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
          </article>

          <article className="w-full flex flex-col xl:flex-row gap-6">
            <Can action="component" object="last-feedback">
              <LastFeedback />
            </Can>
            <Can action="component" object="lessons-rating-stats">
              <TeacherLessonsQualityStats />
            </Can>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
