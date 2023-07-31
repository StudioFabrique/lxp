import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import User from "../../../../utils/interfaces/user";
import TeachersList from "./teachers-list.component";
import { teachersData } from "./teachers-data";
import SearchDropdownMultiple from "../../../UI/search-dropdown-multiple/search-dropdown-multiple";

const AddTeachers: FC<{
  teachers: User[];
  setTeachers: Dispatch<SetStateAction<User[]>>;
}> = ({ teachers, setTeachers }) => {
  const [teachersAvailables, setTeachersAvailable] =
    useState<User[]>(teachersData);

  const handleAddTeacher = (_id: string) => {
    console.log(_id);

    const TeachersToAdd = teachersAvailables.filter(
      (teacher) => teacher._id === _id
    );
    setTeachers((currentTeachers) => [...currentTeachers, ...TeachersToAdd]);
    setTeachersAvailable((currentTeachersAvailable) =>
      currentTeachersAvailable.filter(
        (currentTeacherAvailable) => currentTeacherAvailable._id !== _id
      )
    );
  };

  const handleDeleteTeacher = (_id: string) => {
    setTeachers((currentTeachers) =>
      currentTeachers.filter((teacher) => teacher._id !== _id)
    );

    setTeachersAvailable((currentTeachersAvailable) => [
      ...currentTeachersAvailable,
      ...teachers.filter((currentTeachers) => currentTeachers._id === _id),
    ]);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="formateurs">Formateurs de module</label>
      <SearchDropdownMultiple
        propertyToFilter="_id"
        data={teachersAvailables}
        propertiesToSearch={["firstname", "lastname"]}
        placeHolder="Prénom Nom"
        onAddItem={handleAddTeacher}
      />
      <TeachersList teachers={teachers} onDelete={handleDeleteTeacher} />
    </div>
  );
};

export default AddTeachers;
