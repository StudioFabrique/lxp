import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
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

const ParcoursStudents = () => {
  const dispatch = useDispatch();
  const groups = useSelector(
    (state: any) => state.parcoursGroups.groups
  ) as Group[];
  const { sendRequest } = useHttp();
  const [students, setStudents] = useState<User[] | null>(null);
  const { id } = useParams();
  const groupsIds = useSelector(
    (state: any) => state.parcoursGroups.groupsIds
  ) as string[];
  const isInitialRender = useRef(true);

  // Gère l'ouverture et la fermeture du drawer
  const handleDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  // envoie une requête pour récupérer la liste des étudiants appartenants aux groupes et une requête pour mettre la liste des groupes attachés au parcours à jour
  useEffect(() => {
    let timer: any;
    if (groups) {
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
      sendRequest(
        {
          path: `/user/group`,
          method: "post",
          body: groups.map((item) => item._id),
        },
        applyData
      );
      const processData = (_data: any) => {
        toast.success("Le parcours a été mis à jour");
      };
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
          path: "/group/groups",
          method: "post",
          body: { groupsIds: groupsIds.map((item: any) => item.idMdb) },
        },
        processData
      );
    }
  }, [groupsIds, dispatch, sendRequest]);

  // gère l'ouvertude du drawer pour ajouter des groupes au parcours
  const handleAddGroup = () => {
    handleDrawer("add-group");
  };

  return (
    <div className="flex flex-col gap-y-8">
      <Toaster />{" "}
      <section>
        <RightSideDrawer
          visible={false}
          id="add-group"
          title="Ajouter un groupe"
          onCloseDrawer={handleDrawer}
        >
          <GroupsList onCancel={handleDrawer} />
        </RightSideDrawer>
      </section>
      <section>
        <h1 className="text-3xl font-extrabold capitalize">étudiants</h1>
      </section>
      {!groups || groups.length === 0 ? (
        <section>
          <Wrapper>
            <article className="w-full flex flex-col items-center">
              <div className="py-24">
                <button
                  className="btn btn-primary"
                  onClick={() => handleDrawer("add-group")}
                >
                  Ajouter un groupe
                </button>
              </div>
            </article>
          </Wrapper>
        </section>
      ) : (
        <>
          <section>
            <Wrapper>
              <StudentsList initalList={students ?? []} />
              <div className="mt-2">
                <ButtonAdd
                  label="Ajouter un groupe"
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
