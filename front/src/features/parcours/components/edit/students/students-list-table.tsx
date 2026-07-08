/* eslint-disable @typescript-eslint/no-explicit-any */
import SortColumnIcon from "../../../../../../src.legacy/components/UI/sort-column-icon.component/sort-column-icon.component";
import User from "../../../../../../src/utils/interfaces/user";
import StudentItem from "./student-item";
import { useMemo } from "react";

interface StudentsListTableProps {
  list: User[];
  fieldSort: string;
  direction: boolean;
  sortData: (column: string) => void;
}

const StudentsListTable = (props: StudentsListTableProps) => {
  const { list, fieldSort, direction, sortData } = props;

  const content = useMemo(() => {
    return (
      <table className="table w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th></th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("firstname");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Prénom</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="firstname"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("lastname");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Nom</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="lastname"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("email");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Email</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="email"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("formation");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Formation</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="formation"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("group");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Groupe</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="group"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("createdAt");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Ajouté le</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="createdAt"
                  direction={direction}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {list.map((item: any, index: number) => (
            <tr
              className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content"
              key={index}
            >
              <StudentItem studentItem={item} />
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [list, fieldSort, direction, sortData]);

  return <>{content}</>;
};

export default StudentsListTable;
