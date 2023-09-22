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

const CentreInterets: FC<{
  hobbies: Hobby[];
  setHobbies: Dispatch<SetStateAction<Hobby[]>>;
}> = ({ hobbies, setHobbies }) => {
  const [currentHobby, setCurrentHobby] = useState("");

  const handleAddInteret: KeyboardEventHandler<HTMLInputElement> = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.code === "Enter" &&
      hobbies.filter((hobby) => hobby.title === currentHobby).length === 0 &&
      currentHobby.length > 0
    ) {
      console.log("adding");

      setHobbies((hobbies) => [...hobbies, { title: currentHobby }]);
      setCurrentHobby("");
    }
  };

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentHobby(event.currentTarget.value);
  };

  return (
    <Wrapper>
      <div className="flex flex-col gap-y-2">
        <p className="text-xl font-bold">Centre d'interets</p>
        <input
          onKeyDown={handleAddInteret}
          onChange={handleChangeInput}
          type="text"
          className="input"
          value={currentHobby}
        />
      </div>
      <div className="flex gap-x-5 gap-y-2 flex-wrap overflow-y-auto">
        {hobbies.map((hobby) => (
          <p key={hobby.title} className="bg-slate-800 p-2 rounded-xl h-10">
            {hobby.title}
          </p>
        ))}
      </div>
    </Wrapper>
  );
};

export default CentreInterets;
