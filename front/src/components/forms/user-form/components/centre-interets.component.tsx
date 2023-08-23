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
import Wrapper from "../../../UI/wrapper/wrapper.component";

const CentreInterets: FC<{
  interets: string[];
  setInterets: Dispatch<SetStateAction<string[]>>;
}> = ({ interets, setInterets }) => {
  const [currentInteret, setCurrentInteret] = useState("");

  const handleAddInteret: KeyboardEventHandler<HTMLInputElement> = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.code === "Enter")
      setInterets((interets) => [...interets, currentInteret]);
    return;
  };

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentInteret(event.currentTarget.value);
  };

  return (
    <Wrapper>
      <div className="flex flex-col">
        <p className="text-xl">Centre d'interets</p>
        <input
          onKeyDown={handleAddInteret}
          onChange={handleChangeInput}
          type="text"
          className="input"
        />
      </div>
      <div className="flex gap-x-5">
        {interets.map((interet) => (
          <p className="bg-slate-800 p-2 rounded-xl">{interet}</p>
        ))}
      </div>
    </Wrapper>
  );
};

export default CentreInterets;
