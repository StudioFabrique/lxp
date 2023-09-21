import { useSelector } from "react-redux";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import Wrapper from "../../UI/wrapper/wrapper.component";
import GroupsList from "./groups-list.component";
import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Group from "../../../utils/interfaces/group";
import StudentsList from "./students-list";
import User from "../../../utils/interfaces/user";

const ParcoursStudents = () => {
  const groups = useSelector(
    (state: any) => state.parcoursGroups.groups
  ) as Group[];
  const { sendRequest } = useHttp();
  const [students, setStudents] = useState<User[] | null>(null);

  const handleDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  useEffect(() => {
    if (groups && groups.length > 0) {
      const applyData = (data: any) => {
        let updatedStudents = Array<User>();
        data.forEach((item: any) => {
          updatedStudents = [...updatedStudents, ...item.users];
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
    }
  }, [groups, sendRequest]);

  console.log({ students });

  return (
    <div className="flex flex-col gap-y-8">
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
          <StudentsList initalList={students ?? []} />
        </section>
      )}
      <section></section>
    </div>
  );
};

export default ParcoursStudents;
