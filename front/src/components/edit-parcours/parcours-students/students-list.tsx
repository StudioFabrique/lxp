import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import User from "../../../utils/interfaces/user";
import SortColumnIcon from "../../UI/sort-column-icon.component/sort-column-icon.component";
import StudentItem from "./student-item";

interface StudentsListProps {
  initalList: User[];
}

const StudentsList = (props: StudentsListProps) => {
  const { list, page, setLimit, totalPages, fieldSort, direction, sortData } =
    useEagerLoadingList(props.initalList, "lastname");
  console.log("init", props.initalList);

  console.log({ list });

  return (
    <>
      {list && list.length > 0 ? (
        <table className="table w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th>Avatar</th>
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
                  sortData("group");
                }}
              >
                <div className="flex items-center gap-x-2">
                  <p>Formation</p>
                  <SortColumnIcon
                    fieldSort={fieldSort}
                    column="CDA"
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
            {list.map((item: any) => (
              <tr
                className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content"
                key={item._id}
              >
                <StudentItem studentItem={item} />
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Les groupes choisis sont vides.</p>
      )}
    </>
  );
};

export default StudentsList;
