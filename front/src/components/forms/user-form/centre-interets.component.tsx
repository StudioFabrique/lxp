import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  KeyboardEvent,
  KeyboardEventHandler,
  SetStateAction,
  useState,
} from "react";
import Hobby from "../../../utils/interfaces/hobby";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DeleteIcon from "../../UI/svg/delete-icon.component";

const CentreInterets: FC<{
  hobbies: Hobby[];
  setHobbies: Dispatch<SetStateAction<Hobby[]>>;
}> = ({ hobbies, setHobbies }) => {
  const [currentHobbyValue, setCurrentHobbyValue] = useState("");

  const handleAddHobby: KeyboardEventHandler<HTMLInputElement> = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.code === "Enter" &&
      hobbies.filter((hobby) => hobby.title === currentHobbyValue).length ===
        0 &&
      currentHobbyValue.length > 0
    ) {
      console.log("adding");

      setHobbies((hobbies) => [...hobbies, { title: currentHobbyValue }]);
      setCurrentHobbyValue("");
    }
  };

  const handleDeleteHobby = (title: string) => {
    setHobbies((hobbies) => hobbies.filter((hobby) => hobby.title !== title));
  };

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentHobbyValue(event.currentTarget.value);
  };

  return (
    <Wrapper>
      <div className="flex flex-col gap-y-2">
        <p className="text-xl font-bold">Centre d'intérêts</p>
        <input
          onKeyDown={handleAddHobby}
          onChange={handleChangeInput}
          type="text"
          className="input"
          value={currentHobbyValue}
        />
      </div>
      <div className="flex gap-x-5 gap-y-2 flex-wrap overflow-y-auto">
        {hobbies.map((hobby) => (
          <div
            key={hobby.title}
            className="flex gap-2 bg-secondary text-secondary-content p-2 rounded-xl h-10"
          >
            <p>{hobby.title}</p>
            <span
              className="h-6 w-6 cursor-pointer"
              onClick={() => handleDeleteHobby(hobby.title)}
            >
              <DeleteIcon />
            </span>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default CentreInterets;
