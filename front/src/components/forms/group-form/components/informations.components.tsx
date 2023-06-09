import { FC } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";

const Informations: FC<{ name: any; diplome: any; rncp: any }> = ({
  name,
  diplome,
  rncp,
}) => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Informations</h2>
      <span>
        <label>Titre du groupe</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="text"
          onChange={name.valueChangeHandler}
          onBlur={name.valueBlurHandler}
          defaultValue={name.value}
          autoComplete="off"
        />
      </span>
      <span>
        <label>Diplome visé</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="text"
          onChange={diplome.valueChangeHandler}
          onBlur={diplome.valueBlurHandler}
          defaultValue={diplome.value}
          autoComplete="off"
        />
      </span>
      <span>
        <label>Code RNCP (optionnel)</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="text"
          onChange={rncp.valueChangeHandler}
          onBlur={rncp.valueBlurHandler}
          defaultValue={rncp.value}
          autoComplete="off"
        />
      </span>
      <span className="flex row gap-x-5">
        <label>Statut</label>
        <input
          className="toggle "
          type="checkbox"
          onChange={rncp.valueChangeHandler}
          onBlur={rncp.valueBlurHandler}
          defaultValue={rncp.value}
          autoComplete="off"
        />
        <label>Actif</label>
      </span>
    </Wrapper>
  );
};

export default Informations;
