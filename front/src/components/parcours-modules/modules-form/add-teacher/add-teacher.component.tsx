import { Dispatch, FC, SetStateAction, useState } from "react";
import User from "../../../../utils/interfaces/user";
import TeachersList from "./teachers-list.component";
import { teachersData } from "./teachers-data";
import SearchDropdownMultiple from "../../../UI/search-dropdown-multiple/search-dropdown-multiple";

const AddTeachers: FC<{
  teachers: User[];
  setTeacher: Dispatch<SetStateAction<User[]>>;
}> = ({ teachers, setTeacher }) => {
  const [teachersAvailables, setTeachersAvailable] =
    useState<User[]>(teachersData);

  const handleDeleteTeacher = (_id: string) => {
    setTeacher((currentTeachers) =>
      currentTeachers.filter((teacher) => teacher._id !== _id)
    );
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="formateurs">Formateurs de module</label>
      <SearchDropdownMultiple
        propertyToFilter="_id"
        data={teachersAvailables}
        propertiesToSearch={["firstname", "lastname"]}
      />
      <TeachersList teachers={teachers} onDelete={handleDeleteTeacher} />
    </div>
  );
};

export default AddTeachers;
