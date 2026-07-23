import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";

import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import GroupsList from "./groups-list.component";
import Group from "../../../../../../src/utils/interfaces/group";
import StudentsList from "./students-list";

import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import toast from "react-hot-toast";
import ButtonAdd from "../../../../../components/UI/button-add/button-add";
import QuestionMarkTooltip from "../../../../../components/UI/question-mark-tooltip/question-mark-tooltip";
import { useParcoursGroupsQuery } from "../../../hooks/useParcoursGroupsQuery";
import { useStudentGroupsQuery } from "../../../hooks/useStudentGroupsQuery";
import { useUpdateParcoursGroups } from "../../../hooks/useUpdateParcoursGroups";
import { useParcoursStudentsQuery } from "../../../hooks/useParcoursStudentsQuery";

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
  const { id } = useParams();
  const parcoursId = Number(id);
  const { data: persistedGroups = [] } = useParcoursGroupsQuery(parcoursId);
  const { data: fetchedGroups = [], refetch: fetchGroups } =
    useStudentGroupsQuery();
  const [draftGroups, setDraftGroups] = useState<Group[] | null>(null);
  const groups = draftGroups ?? persistedGroups;
  const groupIds = useMemo(
    () => groups.map((group) => group._id).filter(Boolean) as string[],
    [groups],
  );
  const { data: students = [] } = useParcoursStudentsQuery(groupIds);
  const updateGroups = useUpdateParcoursGroups(parcoursId);

  const handleDrawer = (id: string) => {
    if (fetchedGroups.length === 0) void fetchGroups();
    document.getElementById(id)?.click();
  };

  useEffect(() => {
    if (!draftGroups) return;
    const timer = setTimeout(() => {
      updateGroups.mutate(groupIds, {
        onSuccess: () => toast.success("Le parcours a été mis à jour"),
        onError: () => toast.error("Erreur lors de la mise à jour"),
      });
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [draftGroups, groupIds, updateGroups]);

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
            <GroupsList
              onCancel={handleDrawer}
              groups={fetchedGroups}
              onAdd={(selectedGroups) =>
                setDraftGroups([
                  ...groups,
                  ...selectedGroups.filter(
                    (group) =>
                      !groups.some((current) => current._id === group._id),
                  ),
                ])
              }
            />
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
              <StudentsList
                initalList={students}
                groups={groups}
                onRemoveGroup={(groupId) =>
                  setDraftGroups(groups.filter((group) => group._id !== groupId))
                }
              />
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
