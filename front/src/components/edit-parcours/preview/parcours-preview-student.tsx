import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Group from "../../../utils/interfaces/group";
import User from "../../../utils/interfaces/user";
import { useEffect, useMemo, useState } from "react";
import useHttp from "../../../hooks/use-http";
import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import StudentsListTable from "../parcours-students/students-list-table";

const ParcoursPreviewStudent = () => {
  const groups = useSelector(
    (state: any) => state.parcoursGroups.groups
  ) as Group[];
  const [students, setStudents] = useState<User[] | null>(null);
  const { sendRequest } = useHttp();
  const { list, fieldSort, sortData, direction } = useEagerLoadingList(
    students ?? [],
    "lastname",
    1000
  );

  useEffect(() => {
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
    }
  }, [groups, sendRequest]);

  const groupsList = useMemo(() => {
    let tmp = Array<string>();
    for (let i = 0; i < groups.length; i++) {
      let group = groups[i].name;
      if (i < groups.length - 1) {
        group += ",";
      }
      tmp = [...tmp, group];
    }
    return tmp;
  }, [groups]);

  return (
    <Wrapper>
      <article className="flex flex-col gap-y-8">
        <div className="flex text-xl font-bold">
          <h2>Groupes :&nbsp;</h2>
          <ul className="flex gap-x-2">
            {groupsList.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {list && list.length > 0 ? (
          <StudentsListTable
            list={list}
            fieldSort={fieldSort}
            direction={direction}
            sortData={sortData}
          />
        ) : null}
      </article>
    </Wrapper>
  );
};

export default ParcoursPreviewStudent;
