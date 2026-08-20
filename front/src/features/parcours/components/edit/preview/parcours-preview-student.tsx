import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import Group from "../../../../../../src/utils/interfaces/group";
import useEagerLoadingList from "../../../../../../src/hooks/useEagerLoadingList";
import StudentsListTable from "../students/students-list-table";
import type { StudentWithGroup } from "../../../hooks/useParcoursStudentsQuery";
import EditIcon from "../../../../../../src/components/UI/svg/edit-icon";

interface ParcoursPreviewStudentProps {
  onEdit: (id: number) => void;
  students: StudentWithGroup[];
  groups: Group[];
}

const ParcoursPreviewStudent = (props: ParcoursPreviewStudentProps) => {
  const groups = props.groups;
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
