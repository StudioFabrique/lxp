import React, { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import { Link } from "react-router-dom";
import TeacherLastParcours from "../../components/admin-home/teacher-last-parcours";
import Can from "../../components/UI/can/can.component";
import LastParcours from "../../components/admin-home/last-parcours";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import StatsBar from "../../components/admin-home/stats-bar";
import StatsDonut from "../../components/admin-home/stats-donut";
import StatsLine from "../../components/admin-home/stats-line";
import LastFeedback from "../../components/admin-home/last-feedback";
import useHttp from "../../hooks/use-http";
import Parcours from "../../utils/interfaces/parcours";
import toast from "react-hot-toast";

const links = [
  {
    path: "/admin/formation",
    label: "Créer une formation",
  },
  {
    path: "/admin/parcours/créer-un-parcours",
    label: "Créer un parcours",
  },
  {
    path: "/admin/module",
    label: "Interface modules",
  },
  {
    path: "/admin/course",
    label: "Interface cours",
  },
  {
    path: "/admin/lesson",
    label: "Interface leçons",
  },
  {
    path: "/admin/user",
    label: "Interface utilisateurs",
  },
  {
    path: "/admin/feedbacks",
    label: "Voir les feedbacks",
  },
];

const AdminHome = () => {
  const { logout, user } = useContext(Context);
  const { sendRequest, isLoading, error } = useHttp();
  const [parcours, setParcours] = useState<Parcours[] | null>(null);

  const logoutHandler = () => {
    logout();
  };

  // retourne les deux parcours auquel l'utilisateur est associé en tant que contact
  const getParcours = useCallback(() => {
    const applyData = (data: {
      message: string;
      success: boolean;
      response: Parcours[];
    }) => {
      console.log(data);
      setParcours(data.response);
    };
    sendRequest(
      {
        path: "/user/last-parcours",
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    getParcours();
  }, [getParcours]);

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <main className="w-full flex flex-col gap-4">
        <section className="flex flex-col-reverse xl:flex-row justify-between items-start xl:items-center">
          <article className="w-full">
            <span className="w-full flex flex-1 flex-col gap-y-2">
              <h2 className="w-full text-3xl font-extrabold capitalize">
                Bonjour, {user?.roles[0].label} {user?.firstname}{" "}
                {user?.lastname} !
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                in urna eget pura.
              </p>
            </span>
          </article>
        </section>
        <section>
          <ul className="flex items-center gap-x-2">
            <Can action="write" object="formation">
              <li key={0}>
                <Link className="btn btn-primary" to={links[0].path}>
                  {links[0].label}
                </Link>
              </li>
            </Can>
            <Can action="write" object="parcours">
              <li key={1}>
                <Link className="btn btn-primary" to={links[1].path}>
                  {links[1].label}
                </Link>
              </li>
            </Can>
            <Can action="write" object="module">
              <li>
                <Link className="btn btn-primary" to={links[2].path}>
                  {links[2].label}
                </Link>
              </li>
            </Can>
            {links.map((item, index) => (
              <React.Fragment key={item.label}>
                {index > 1 ? (
                  <li>
                    <Link className="btn btn-primary" to={item.path}>
                      {item.label}
                    </Link>
                  </li>
                ) : null}
              </React.Fragment>
            ))}
          </ul>
        </section>
        <section className="w-full flex flex-col xl:flex-row gap-4">
          <span className="flex-1 flex flex-col gap-4">
            <article className="w-full flex flex-col gap-y-2">
              {user?.roles.find((role) => role.role === "teacher") &&
              parcours &&
              parcours.length > 0 ? (
                <TeacherLastParcours
                  parcours={parcours}
                  isLoading={isLoading}
                />
              ) : null}
              <LastParcours />
            </article>
            <article className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Wrapper>
                <div className="w-full h-full flex flex-col items-center xl:items:start">
                  <StatsBar />
                  <StatsDonut />
                </div>
              </Wrapper>
              <Wrapper>
                <LastFeedback />
              </Wrapper>
            </article>
          </span>
          <article>
            <ul className="w-full grid grid-cols-1 gap-4 place-items-center">
              <li className="w-fit xl:w-full">
                <Wrapper>
                  <StatsLine />
                </Wrapper>
              </li>
              <li className="w-fit xl:w-full">
                <Wrapper>
                  <StatsLine />
                </Wrapper>
              </li>
            </ul>
          </article>
        </section>
        <div>
          <section className="w-full flex flex-col xl:flex-row gap-x-4 gap-y-4">
            <article></article>
          </section>
          <section>
            <article></article>
          </section>
          <section>
            <article></article>
          </section>
        </div>
      </main>
      <div className="home bg-red h-screen flex flex-col items-center">
        <p>Hey je suis la page Home</p>
        <button onClick={logoutHandler}>logout</button>
        <Link to="user">Interface utilisateurs</Link>
        <Link to="group">Interface Groupes</Link>
        <Link to="parcours">Interface Parcours</Link>
        <Link to="course">Interface des Cours</Link>
        <Link to="roles">Interface Roles</Link>
        <Link to="module">Interface Module</Link>
        <Link to="lesson">Interface Leçon</Link>
        <Link to="profil">Profil</Link>
        <Link to="teacher">Formateurs</Link>
      </div>
    </>
  );
};

export default AdminHome;
