import { useSelector } from "react-redux";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import Wrapper from "../../UI/wrapper/wrapper.component";
import GroupsList from "./groups-list.component";
import { useEffect, useRef, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Group from "../../../utils/interfaces/group";
import StudentsList from "./students-list";
import User from "../../../utils/interfaces/user";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { parcoursGroupsAction } from "../../../store/redux-toolkit/parcours/parcours-groups";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

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

  const handleDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

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
      const processData = (data: any) => {
        toast.success("Le parcours a été mis à jour");
      };
      sendRequest(
        {
          path: `/user/group`,
          method: "post",
          body: groups.map((item) => item._id),
        },
        applyData
      );
      if (!isInitialRender.current) {
        timer = setTimeout(() => {
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
        }, autoSubmitTimer);
      } else {
        isInitialRender.current = false;
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [groups, id, sendRequest]);

  useEffect(() => {
    const processData = (data: any) => {
      console.log({ data });

      dispatch(parcoursGroupsAction.setGroups(data));
    };
    sendRequest(
      {
        path: "/group/groups",
        method: "post",
        body: { groupsIds: groupsIds.map((item: any) => item.idMdb) },
      },
      processData
    );
  }, [groupsIds, dispatch, sendRequest]);

  return (
    <div className="flex flex-col gap-y-8">
      <Toaster />
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
              <RightSideDrawer
                visible={false}
                id="add-group"
                title="Ajouter un groupe"
                onCloseDrawer={handleDrawer}
              >
                <GroupsList onCancel={handleDrawer} />
              </RightSideDrawer>
            </article>
          </Wrapper>
        </section>
      ) : (
        <section>
          <Wrapper>
            <StudentsList initalList={students ?? []} />
          </Wrapper>
        </section>
      )}
      <section></section>
    </div>
  );
};

export default ParcoursStudents;
