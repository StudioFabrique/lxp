import { ChangeEvent, useState } from "react";
import BoxWrapper from "../../../../../src/components/wrappers/BoxWrapper";
import Graduation from "../../interfaces/graduation";
import { addIdToObject } from "../../../../../src/utils/helpers/add-id-to-objects";
import { formatDateToYYYYMMDD } from "../../../../../src/utils/helpers/convert-date";
import DatePicker from "../../../../../src/components/UI/date-picker/date-picker";
import { parseDateValue } from "../../../../../src/components/UI/date-picker/date-picker.utils";
import { cn } from "../../../../../src/utils/cn";
import { Pencil, Trash2 } from "lucide-react";

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

  const handleDelete = (graduation: Graduation) => {
    setGraduations(
      graduations.filter((item) =>
        graduation._id ? item._id !== graduation._id : item.id !== graduation.id,
      ),
    );
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
    }
  };

  const handleDateChange = (value: string) => {
    const date = parseDateValue(value);
    if (!date) return;
    setCurrent({
      title: current.title ?? "",
      degree: current.degree!,
      date,
    });
  };

  return (
    <BoxWrapper>
      <div className={cn("grid gap-x-10", graduations.length > 0 && "md:grid-cols-2")}>
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
              <DatePicker
                id="certificationDate"
                name="date"
                label="Date de certification"
                value={formatDateToYYYYMMDD(new Date(current.date))}
                onChange={handleDateChange}
                max={formatDateToYYYYMMDD(new Date())}
                clearable={false}
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
        {graduations.length > 0 && (
          <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto rounded-lg border border-base-300 bg-base-100/60 p-3 md:my-1" aria-label="Certifications enregistrées">
            {graduations.map((g) => (
              <li
                key={g._id ?? g.id}
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-lg border border-base-300 bg-base-100 px-3 py-2 shadow-sm",
                  editMode.isActive &&
                    (g._id ? g._id === editMode._idToEdit : g.id === editMode.idToEdit) &&
                    "border-primary",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold" title={g.title}>{g.title}</p>
                  <p className="truncate text-sm text-base-content/70">
                    {g.degree} · {new Date(g.date).getFullYear()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleSetEdit(g)}
                    className="btn btn-ghost btn-square btn-sm text-primary"
                    aria-label={`Modifier la certification ${g.title}`}
                    title="Modifier"
                    disabled={disabled}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(g)}
                    className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10"
                    aria-label={`Supprimer la certification ${g.title}`}
                    title="Supprimer"
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BoxWrapper>
  );
};

export default UserFormCertifications;
