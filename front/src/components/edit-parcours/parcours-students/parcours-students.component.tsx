/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import Wrapper from "../../UI/wrapper/wrapper.component";
import GroupsList from "./groups-list.component";
import useHttp from "../../../hooks/use-http";
import Group from "../../../utils/interfaces/group";
import StudentsList from "./students-list";
import User from "../../../utils/interfaces/user";
import { parcoursGroupsAction } from "../../../store/redux-toolkit/parcours/parcours-groups";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import ButtonAdd from "../../UI/button-add/button-add";
import toast from "react-hot-toast";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";

// Interface définissant la structure d'un groupe d'étudiants
export type GroupList = {
  _id: string;
  name: string;
  desc: string;
  formation: string;
  nbStudents: number;
  users: string[];
  isActive: boolean;
  isSelected: boolean;
};

/**
 * Composant qui gère l'affichage et la gestion des étudiants d'un parcours
 * Les étudiants sont regroupés par groupes qui peuvent être ajoutés ou supprimés du parcours
 */
const ParcoursStudents = () => {
  const [fetchedGroups, setFetchedGroups] = useState<GroupList[]>([]);
  const dispatch = useDispatch();
  // Récupère la liste des groupes depuis le store Redux
  const groups = useSelector(
    (state: any) => state.parcoursGroups.groups
  ) as Group[];
  const { sendRequest } = useHttp();
  // État local pour stocker la liste des étudiants
  const [students, setStudents] = useState<User[] | null>(null);
  // Récupère l'id du parcours depuis l'URL
  const { id } = useParams();
  // Récupère les IDs des groupes depuis le store Redux
  const groupsIds = useSelector(
    (state: any) => state.parcoursGroups.groupsIds
  ) as string[];
  // Référence pour gérer le premier rendu du composant
  const isInitialRender = useRef(true);

  /**
   * Gère l'ouverture et la fermeture du drawer latéral
   * Charge la liste des groupes d'étudiants à la première ouverture du drawer
   * @param id - L'identifiant du drawer à ouvrir/fermer
   */
  const handleDrawer = (id: string) => {
    if (fetchedGroups.length === 0) fetchGroups();
    document.getElementById(id)?.click();
  };

  /**
   * Charge la liste des groupes d'étudiants à la première ouverture du drawer
   */
  const fetchGroups = useCallback(() => {
    const applyData = (data: {
      success: true;
      message: string;
      data: GroupList[];
    }) => {
      console.log({ data });

      if (data.success) {
        setFetchedGroups(
          data.data.map((item) => ({ ...item, isSelected: false }))
        );
      }
    };
    sendRequest({ path: "/group/student" }, applyData);
  }, [sendRequest]);

  // envoie une requête pour récupérer la liste des étudiants appartenants aux groupes et une requête pour mettre la liste des groupes attachés au parcours à jour
  useEffect(() => {
    let timer: any;
    if (groups) {
      // Fonction qui met à jour la liste des étudiants avec leurs groupes respectifs
      const applyData = (data: any) => {
        let updatedStudents = Array<User>();
        data.forEach((item: any) => {
          const updatedItem = item.users.map((user: any) => ({
            ...user,
            group: { _id: item._id, name: item.name },
          }));
          updatedStudents = [...updatedStudents, ...updatedItem];
        });
        setStudents(updatedStudents);
      };
      // Requête pour récupérer les étudiants des groupes
      sendRequest(
        {
          path: `/user/group`,
          method: "post",
          body: groups.map((item) => item._id),
        },
        applyData
      );
      // Fonction appelée après la mise à jour des groupes du parcours
      const processData = (_data: any) => {
        toast.success("Le parcours a été mis à jour");
      };
      // Timer pour l'auto-sauvegarde des modifications
      timer = setTimeout(() => {
        if (!isInitialRender.current) {
          sendRequest(
            {
              path: "/parcours/groups",
              method: "put",
              body: {
                parcoursId: id,
                groupsIds: groups.map((item) => item._id),
              },
            },
            processData
          );
        } else {
          isInitialRender.current = false;
        }
      }, autoSubmitTimer);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, groups, id, sendRequest]);

  // qd le parcours est chargé en mémoire, s'il a déjà des groupes, les ids de ces derniers sont stockés en mémoire
  // qd ce composant est initialisé, le useEffect récupère la liste des groupes venant venant de la collection Group de la bdd MongoDB
  // les ids des groupes stockés lors du chargement du parcours en mémoire sont ensuite effacés pour que la requête ne se relance plus
  useEffect(() => {
    const processData = (data: any) => {
      dispatch(parcoursGroupsAction.setGroups(data));
      dispatch(parcoursGroupsAction.resetGroupsIds());
    };
    if (groupsIds) {
      sendRequest(
        {
          path: "/user/group",
          method: "post",
          body: groupsIds.map((item: any) => item.idMdb),
        },
        processData
      );
    }
  }, [groupsIds, dispatch, sendRequest]);

  /**
   * Gère l'ouverture du drawer pour ajouter des groupes au parcours
   */
  const handleAddGroup = () => {
    handleDrawer("add-group");
  };

  return (
    <div className="flex flex-col gap-y-8">
      {/* Section du drawer pour l'ajout de groupes */}
      <section>
        <RightSideDrawer
          visible={false}
          id="add-group"
          title="Ajouter un groupe"
          onCloseDrawer={handleDrawer}
        >
          <div className="flex flex-col gap-y-12">
            <GroupsList onCancel={handleDrawer} groups={fetchedGroups} />
            <span className="flex items-center gap-x-2 text-xs">
              <p className="text-info">
                Votre groupe ne se trouve pas dans la liste ?
              </p>
              <Link
                className="underline"
                to={`/admin/group/add?parcours=${id}`}
              >
                Créez-en un nouveau :)
              </Link>
              <QuestionMarkTooltip
                tooltipPosition="left"
                tooltipValue="Vous pouvez créer un groupe d'étudiants en suivant ce lien. Une fois la création du groupe terminée, vous serez redirigé vers cette vue."
              />
            </span>
          </div>
        </RightSideDrawer>
      </section>
      {/* Titre de la page */}
      <section>
        <h1 className="text-3xl font-extrabold">Groupe d'apprenants</h1>
      </section>
      {/* Affichage conditionnel selon la présence ou non de groupes */}
      {!groups || groups.length === 0 ? (
        // Si aucun groupe n'est présent, affiche un bouton pour en ajouter
        <section>
          <Wrapper>
            <article className="w-full flex flex-col items-center">
              <div className="py-24">
                <button
                  className="btn btn-primary"
                  onClick={() => handleDrawer("add-group")}
                >
                  Ajouter un groupe d'apprenants
                </button>
              </div>
            </article>
          </Wrapper>
        </section>
      ) : (
        // Si des groupes sont présents, affiche la liste des étudiants
        <>
          <section>
            <Wrapper>
              <StudentsList initalList={students ?? []} />
              <div className="mt-2">
                <ButtonAdd
                  label="Ajouter un groupe d'apprenants"
                  outline={true}
                  onClickEvent={handleAddGroup}
                />
              </div>
            </Wrapper>
          </section>
        </>
      )}
    </div>
  );
};

export default ParcoursStudents;
