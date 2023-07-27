import { Dispatch, FC, SetStateAction, useState } from "react";
import SearchDropdown from "../../../UI/search-dropdown/search-dropdown";
import User from "../../../../utils/interfaces/user";
import TeachersList from "./teachers-list.component";
import { teachersData } from "./teachers-data";

const AddTeachers: FC<{
  teachers: User[];
  setTeacher: Dispatch<SetStateAction<User[]>>;
}> = ({ teachers, setTeacher }) => {
  const [teachersAvailables, setTeachersAvailable] =
    useState<User[]>(teachersData);

  const getTeacherFromDb = (_id: string) => {
    return teachersData.filter((teacher) => teacher._id === _id)[0];
  };

  const handleAddTeacher = (name: string, property: string) => {
    console.log("name : " + name);
    console.log("property : " + property);
    setTeacher((currentTeachers) => [
      ...currentTeachers,
      getTeacherFromDb(name),
    ]);
  };

  const handleFilterTeachersAvailables = (name: string, property: string) => {
    const filteredTeachersAvailable = teachersAvailables.filter(
      (teacher) => teacher._id === name
    );
    setTeachersAvailable(filteredTeachersAvailable);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="formateurs">Formateurs de module</label>
      <SearchDropdown
        placeHolder="Rechercher un formateur de module"
        addItem={handleAddTeacher}
        filterItems={handleFilterTeachersAvailables}
        filteredItems={teachersAvailables}
        property="firstname"
        resetFilterItems={() => {}}
        propertiesToRender={["firstname", "lastname"]}
        getId="_id"
      />
      <TeachersList teachers={teachers} />
    </div>
  );
};

export default AddTeachers;
