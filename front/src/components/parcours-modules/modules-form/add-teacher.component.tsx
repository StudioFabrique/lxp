import { Dispatch, FC, SetStateAction } from "react";
import SearchDropdown from "../../UI/search-dropdown/search-dropdown";
import User from "../../../utils/interfaces/user";

const AddTeachers: FC<{
  teachers: User[];
  setTeacher: Dispatch<SetStateAction<User[]>>;
}> = ({ teachers, setTeacher }) => {
  const handleAddTeacher = () => {};

  return (
    <div className="flex flex-col">
      <label htmlFor="formateurs">Formateurs de module</label>
      {/* <SearchDropdown
        placeHolder="Rechercher un formateur de module"
        addItem={}
        filterItems={}
        filteredItems={}
        property=""
        resetFilterItems={() => {}}
      /> */}
    </div>
  );
};

export default AddTeachers;
