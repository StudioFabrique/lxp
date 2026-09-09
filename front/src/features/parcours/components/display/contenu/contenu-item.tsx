import { Dispatch, SetStateAction, useMemo } from "react";
import Module from "../../../../../../src/utils/interfaces/module";
import { getMonth } from "../../../helpers/date-helpers";
import { ArrowRightCircle, CalendarOffIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { cn } from "../../../../../utils/cn";

type Props = {
  module: Module;
  iterationCount: number;
  selectedModuleId: number | undefined;
  setSelectedModule: Dispatch<SetStateAction<Module | null>>;
};

const ContenuItem = ({
  module,
  iterationCount,
  selectedModuleId,
  setSelectedModule,
}: Props) => {
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
      className="group flex cursor-pointer items-stretch gap-x-3"
      onClick={() => setSelectedModule(module)}
      onDoubleClick={() => navigate(`../module/${module.id}`)}
    >
      <div
        className={cn(
          "flex min-h-20 w-24 shrink-0 flex-col items-center justify-center rounded-lg bg-primary p-4 text-primary-content shadow-sm transition-colors",
          { "bg-base-100 text-base-content": !isSelected },
        )}
      >
        {minDate.day === null ? (
          <span
            className="flex flex-col items-center gap-1 text-center"
            aria-label="Date du module à planifier"
          >
            <CalendarOffIcon />
            <span className="text-xs font-semibold leading-none opacity-80">
              Pas de dates
            </span>
          </span>
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
        className={`flex min-h-20 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg p-4 shadow-sm transition-colors select-none ${
          isSelected
            ? "bg-primary text-primary-content shadow-md"
            : "bg-base-100 text-base-content group-hover:bg-base-200"
        }`}
      >
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm opacity-80 ${isSelected ? "text-primary-content" : ""}`}
          >{`Module ${iterationCount}`}</p>
          <p className="wrap-break-word text-base font-semibold">
            {module.title}
          </p>
        </div>
        <Link
          className={cn(
            "btn btn-sm btn-ghost shrink-0 self-center",
            isSelected
              ? "text-primary-content hover:text-primary"
              : "hover:text-primary",
          )}
          to={`../module/${module.id}`}
          aria-label={`Voir le module ${module.title}`}
        >
          <ArrowRightCircle />
        </Link>
      </div>
    </div>
  );
};

export default ContenuItem;
