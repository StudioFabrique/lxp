import { ChangeEvent, useState } from "react";
import Wrapper from "../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import Graduation from "../../../../utils/interfaces/graduation";
import { addIdToObject } from "../../../../../src/utils/helpers/add-id-to-objects";

type EditState = {
  isActive: boolean;
  idToEdit: number | null;
  _idToEdit: string | null;
};

type Props = {
  graduations: Graduation[];
  setGraduations: (v: Graduation[]) => void;
  disabled?: boolean;
};

const initGraduation = { title: "", date: new Date(), degree: "" };

const UserFormCertifications = ({ graduations, setGraduations, disabled }: Props) => {
  const [current, setCurrent] = useState<Graduation>(initGraduation);
  const [editMode, setEditMode] = useState<EditState>({
    isActive: false, idToEdit: null, _idToEdit: null,
  });

  const handleAdd = () => {
    if (current.date && current.degree && current.title) {
      setGraduations(addIdToObject([...graduations, current]));
      setCurrent(initGraduation);
    }
  };

  const handleSetEdit = (g: Graduation) => {
    if (!g.id && !g._id) return;
    setCurrent(g);
    setEditMode(
      g._id
        ? { isActive: true, idToEdit: null, _idToEdit: g._id }
        : { isActive: true, idToEdit: g.id ?? null, _idToEdit: null },
    );
  };

  const handleEdit = () => {
    if (current.date && current.degree && current.title) {
      setGraduations(
        graduations.map((item) =>
          editMode._idToEdit
            ? item._id === editMode._idToEdit
              ? { ...item, ...current }
              : item
            : item.id === editMode.idToEdit
              ? { ...item, ...current }
              : item,
        ),
      );
      setCurrent(initGraduation);
      setEditMode({ isActive: false, idToEdit: null, _idToEdit: null });
    }
  };

  const handleDelete = (id: number) => {
    setGraduations(graduations.filter((item) => item.id !== id));
    setCurrent(initGraduation);
    setEditMode({ isActive: false, idToEdit: null, _idToEdit: null });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.getAttribute("name");
    switch (name) {
      case "title":
        setCurrent({ title: e.currentTarget.value, degree: current.degree ?? "", date: current.date ?? new Date() });
        break;
      case "degree":
        setCurrent({ title: current.title ?? "", degree: e.currentTarget.value, date: current.date ?? new Date() });
        break;
      case "date":
        setCurrent({ title: current.title ?? "", degree: current.degree!, date: new Date(e.currentTarget.value) });
        break;
    }
  };

  return (
    <Wrapper>
      <div className="grid grid-cols-2 gap-x-10">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col justify-between gap-y-3">
            <h2 className="font-bold text-xl">Certifications</h2>
            <span className="flex flex-col gap-y-2">
              <label>Titre du diplôme</label>
              <input
                name="title"
                className="input input-sm input-bordered focus:outline-none w-full"
                type="text"
                onChange={handleChange}
                value={current.title}
                autoComplete="off"
                disabled={disabled}
              />
            </span>
            <span className="flex flex-col gap-y-2">
              <label>Niveau du diplôme</label>
              <input
                name="degree"
                className="input input-sm input-bordered focus:outline-none w-full"
                type="text"
                onChange={handleChange}
                value={current.degree}
                autoComplete="off"
                disabled={disabled}
              />
            </span>
            <span className="flex flex-col gap-y-2">
              <label>Date de certification</label>
              <input
                name="date"
                className="input input-sm input-bordered focus:outline-none w-full"
                type="date"
                value={new Date(current.date).toISOString().split("T")[0]}
                onChange={handleChange}
                autoComplete="off"
                disabled={disabled}
              />
            </span>
          </div>
          {editMode.isActive ? (
            <button type="button" className="mt-2 normal-case self-start btn btn-primary" onClick={handleEdit} disabled={disabled}>
              Modifier la certification
            </button>
          ) : (
            <button type="button" className="mt-2 normal-case self-start btn btn-primary" onClick={handleAdd} disabled={disabled}>
              Ajouter la certification
            </button>
          )}
        </div>
        <div className="bg-secondary/10 flex flex-col items-center gap-y-4 p-5 m-2 rounded-xl md:h-[300px] lg:h-[400px] overflow-y-auto">
          {graduations.map((g) => (
            <div
              key={g._id ?? g.id}
              className="flex items-center justify-between bg-secondary/20 rounded-md w-full py-2 px-5 max-h-[80px]"
            >
              <span>
                <p className="text-lg font-bold">{g.title}</p>
                <p>{new Date(g.date).getFullYear()}</p>
              </span>
              <span className="flex items-center gap-2">
                <button type="button" onClick={() => handleSetEdit(g)} className="h-6 w-6 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </button>
                <button type="button" onClick={() => handleDelete(g.id!)} className="h-6 w-6 cursor-pointer text-error">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default UserFormCertifications;
