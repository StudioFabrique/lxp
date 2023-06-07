import { FC } from "react";

const Informations: FC<{ name: any; diplome: any; rncp: any }> = ({
  name,
  diplome,
  rncp,
}) => {
  return (
    <div className="p-4 bg-slate-100/80 rounded-2xl flex flex-col gap-y-5">
      <h2 className="font-bold text-xl">Informations</h2>
      <span>
        <label>Titre du groupe</label>
        <input
          className="input input-sm w-full bg-indigo-100/60 p-[20px] pl-[30px]"
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
          className="input input-sm w-full bg-indigo-100/60 p-[20px] pl-[30px]"
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
          className="input input-sm w-full bg-indigo-100/60 p-[20px] pl-[30px]"
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
    </div>
  );
};

export default Informations;
