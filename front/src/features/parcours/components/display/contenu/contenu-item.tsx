import { Dispatch, FC, SetStateAction, useMemo } from "react";
import Module from "../../../../../../src/utils/interfaces/module";
import { getMonth } from "../../../helpers/date-helpers";
import { ArrowRightCircle, CalendarOffIcon, Pencil, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { cn } from "../../../../../utils/cn";

const ContenuItem: FC<{
  module: Module;
  iterationCount: number;
  selectedModuleId: number | undefined;
  setSelectedModule: Dispatch<SetStateAction<Module | null>>;
  editDatesUrl?: string;
}> = ({
  module,
  iterationCount,
  selectedModuleId,
  setSelectedModule,
  editDatesUrl,
}) => {
  const minDate: { day: number | null; month: string } = useMemo(() => {
    if (!module.minDate) {
      return { day: null, month: "" };
    }
    const date = new Date(module.minDate);
    if (Number.isNaN(date.getTime())) {
      return { day: null, month: "" };
    }
    return {
      day: date.getDate(),
      month: getMonth(date.getMonth())?.substring(0, 4) ?? "",
    };
  }, [module.minDate]);

  const navigate = useNavigate();
  const isSelected = selectedModuleId === module.id;

  return (
    <div
      data-testid="contenu-item"
      className="flex gap-x-3 items-center group cursor-pointer"
      onClick={() => setSelectedModule(module)}
      onDoubleClick={() => navigate(`../module/${module.id}`)}
    >
      <div
        className={cn(
          "flex flex-col bg-secondary text-secondary-content items-center justify-center p-4 w-24 rounded-lg h-20 transition-colors",
          { "bg-base-200 text-base-content": !isSelected },
        )}
      >
        {minDate.day === null ? (
          editDatesUrl ? (
            <Link
              to={editDatesUrl}
              className="group/date relative flex flex-col items-center gap-1 rounded-md text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              aria-label={`Planifier les dates du module ${module.title}`}
              onClick={(event) => event.stopPropagation()}
            >
              <span className="flex flex-col items-center gap-1 transition duration-200 group-hover/date:blur-[2px] group-focus-visible/date:blur-[2px]">
                <CalendarOffIcon />
                <span className="text-xs font-semibold leading-none opacity-80">
                  Pas de dates
                </span>
              </span>
              <span
                className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-primary/90 text-primary-content opacity-0 shadow-md backdrop-blur-sm transition duration-200 group-hover/date:scale-100 group-hover/date:opacity-100 group-focus-visible/date:scale-100 group-focus-visible/date:opacity-100"
                aria-hidden="true"
              >
                <Plus className="h-5 w-5 shrink-0" />
              </span>
            </Link>
          ) : (
            <span
              className="flex flex-col items-center gap-1 text-center"
              aria-label="Date du module à planifier"
            >
              <CalendarOffIcon />
              <span className="text-xs font-semibold leading-none opacity-80">
                Pas de dates
              </span>
            </span>
          )
        ) : editDatesUrl ? (
          <Link
            to={editDatesUrl}
            className="group/date relative flex flex-col items-center rounded-md text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            aria-label={`Modifier les dates du module ${module.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <span className="flex flex-col items-center transition duration-200 group-hover/date:blur-[2px] group-focus-visible/date:blur-[2px]">
              <span className="text-xl font-bold">{minDate.day}</span>
              <span className="text-sm font-bold uppercase opacity-80">
                {minDate.month}
              </span>
            </span>
            <span
              className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-primary/90 text-primary-content opacity-0 shadow-md backdrop-blur-sm transition duration-200 group-hover/date:scale-100 group-hover/date:opacity-100 group-focus-visible/date:scale-100 group-focus-visible/date:opacity-100"
              aria-hidden="true"
            >
              <Pencil className="h-4 w-4 shrink-0" />
            </span>
          </Link>
        ) : (
          <>
            <p className="font-bold text-xl">{minDate.day}</p>
            <p className="font-bold uppercase text-sm opacity-80">
              {minDate.month}
            </p>
          </>
        )}
      </div>

      <div
        className={`flex h-20 items-center p-4 justify-between rounded-lg w-full transition-colors select-none ${
          isSelected
            ? "bg-primary text-primary-content shadow-md"
            : "bg-base-200 text-base-content group-hover:bg-base-300"
        }`}
      >
        <div>
          <p
            className={`text-sm opacity-80 ${isSelected ? "text-primary-content" : ""}`}
          >{`Module ${iterationCount}`}</p>
          <p className="text-base font-semibold">{module.title}</p>
        </div>
        <Link
          className={cn(
            "btn btn-sm btn-ghost self-end",
            isSelected
              ? "text-primary-content hover:text-primary"
              : "hover:text-primary",
          )}
          to={`../module/${module.id}`}
        >
          <ArrowRightCircle />
        </Link>
      </div>
    </div>
  );
};

export default ContenuItem;
