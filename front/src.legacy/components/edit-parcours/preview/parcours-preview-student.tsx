/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";

import Wrapper from "../../UI/wrapper/wrapper.component";
import Group from "../../../utils/interfaces/group";
import User from "../../../utils/interfaces/user";
import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import StudentsListTable from "../parcours-students/students-list-table";
import EditIcon from "../../UI/svg/edit-icon";

interface ParcoursPreviewStudentProps {
  onEdit: (id: number) => void;
  students: User[];
}

const ParcoursPreviewStudent = (props: ParcoursPreviewStudentProps) => {
  const groups = useSelector(
    (state: any) => state.parcoursGroups.groups
  ) as Group[];
  const { list, fieldSort, sortData, direction } = useEagerLoadingList(
    props.students,
    "lastname",
    1000
  );

  return (
    <Wrapper>
      <article className="flex flex-col gap-y-2">
        <div className="flex items-center">
          <span className="w-full flex justify-between items-center">
            <span className="flex flex-col gap-y-2">
              <h2 className="text-xl font-bold">Apprenants</h2>
              <ul className="flex gap-x-2">
                {groups.map((item: Group) => (
                  <li
                    className="badge badge-outline badge-primary text-xs"
                    key={item._id}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </span>
            <div
              className="w-6 h-6 text-primary cursor-pointer"
              onClick={() => props.onEdit(6)}
            >
              <EditIcon />
            </div>
          </span>
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
