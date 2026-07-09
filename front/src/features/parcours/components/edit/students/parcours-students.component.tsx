/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";

import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import GroupsList from "./groups-list.component";
import Group from "../../../../../../src/utils/interfaces/group";
import StudentsList from "./students-list";
import User from "../../../../../../src/utils/interfaces/user";

import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import toast from "react-hot-toast";
import { parcoursApi } from "../../../api/parcours.api";
import ButtonAdd from "../../../../../components/UI/button-add/button-add";
import QuestionMarkTooltip from "../../../../../components/UI/question-mark-tooltip/question-mark-tooltip";

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

const ParcoursStudents = () => {
  const [fetchedGroups, setFetchedGroups] = useState<GroupList[]>([]);
  const dispatch = useParcoursDispatch();
  const groups = useParcoursSelector(
    (state) => state.parcoursGroups.groups
  ) as Group[];
  const [students, setStudents] = useState<User[] | null>(null);
  const { id } = useParams();
  const groupsIds = useParcoursSelector(
    (state) => state.parcoursGroups.groupsIds
  ) as { idMdb: string }[];
  const isInitialRender = useRef(true);

  const handleDrawer = (id: string) => {
    if (fetchedGroups.length === 0) fetchGroups();
    document.getElementById(id)?.click();
  };

  const fetchGroups = useCallback(async () => {
    try {
      const res = await parcoursApi.queries.getStudentGroups();
      if (res.success) {
        setFetchedGroups(
          res.data.map((item: GroupList) => ({ ...item, isSelected: false }))
        );
      }
    } catch {
      toast.error("Erreur lors du chargement des groupes");
    }
  }, []);

  useEffect(() => {
    let timer: any;
    if (groups) {
      const fetchStudents = async () => {
        try {
          const data = await parcoursApi.queries.getStudentsByGroupIds(
            groups.map((item) => item._id).filter(Boolean) as string[]
          );
          let updatedStudents = Array<User>();
          (data as any[]).forEach((item: any) => {
            const updatedItem = item.users.map((user: any) => ({
              ...user,
              group: { _id: item._id, name: item.name },
            }));
            updatedStudents = [...updatedStudents, ...updatedItem];
          });
          setStudents(updatedStudents);
        } catch {
          toast.error("Erreur lors du chargement des étudiants");
        }
      };
      fetchStudents();

      timer = setTimeout(() => {
        if (!isInitialRender.current) {
          parcoursApi.mutations
            .updateParcoursGroups({
              parcoursId: id!,
              groupsIds: groups.map((item) => item._id).filter(Boolean) as string[],
            })
            .then(() => toast.success("Le parcours a été mis à jour"))
            .catch(() => toast.error("Erreur lors de la mise à jour"));
        } else {
          isInitialRender.current = false;
        }
      }, autoSubmitTimer);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [groups, id]);

  useEffect(() => {
    const fetchGroupsByIds = async () => {
      try {
        const data = await parcoursApi.queries.getStudentsByGroupIds(
          groupsIds.map((item: any) => item.idMdb)
        );
        dispatch({ type: "SET_GROUPS", payload: data });
        dispatch({ type: "RESET_GROUPS_IDS" });
      } catch {
        toast.error("Erreur lors du chargement des groupes");
      }
    };
    if (groupsIds) {
      fetchGroupsByIds();
    }
  }, [groupsIds, dispatch]);

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
