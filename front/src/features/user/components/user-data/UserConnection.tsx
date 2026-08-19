import User from "../../../../utils/interfaces/user";
import Parcours from "../../../../utils/interfaces/parcours";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import StudentCard from "./StudentCard";
import StatsProgression from "./StatsProgression";
import ElementNotFound from "../../../../components/UI/element-not-found";
import TokensUsed from "./TokensUsed";
import type {
  Indicator,
  IndicatorModuleProgress,
} from "../../interfaces/indicators";

export type TokenStat = {
  _id: string;
  date: string;
  tokensUsed: number;
};

interface UserConnectionProps {
  student: User;
  parcours: Parcours | null;
  tokenStats?: TokenStat[];
  /** Indicateur `parcours_progression`, `null` tant qu'il n'est pas chargé. */
  progression: Indicator | null;
}

function readModules(progression: Indicator | null): IndicatorModuleProgress[] {
  const modules = progression?.meta?.modules;
  return Array.isArray(modules) ? (modules as IndicatorModuleProgress[]) : [];
}

export default function UserConnection({
  student,
  parcours,
  tokenStats,
  progression,
}: UserConnectionProps) {
  const completion =
    progression?.available && typeof progression.value === "number"
      ? progression.value
      : 0;
  const modules = readModules(progression);

  const style = {
    "--value": completion,
    "--size": "3rem",
    "--thickness": "4px",
  } as React.CSSProperties;

  return (
    <article className="flex-1">
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BoxWrapper>
            <StudentCard
              avatar={student?.avatar}
              firstname={student.firstname}
              lastname={student.lastname}
              email={student.email}
              phoneNumber={student.phoneNumber ?? "Non renseigné"}
              parcours={parcours?.title ?? "Aucun parcours"}
              status={student.isActive ? "Actif" : "Inactif"}
            />
          </BoxWrapper>
          <div className="col-span-2">
            <BoxWrapper>
              <div className="flex justify-between items-start">
                <h2 className="font-bold text-xl">
                  Progression de l'apprentissage
                </h2>
                <span>
                  <div
                    className={"radial-progress text-primary md:mt-0 mt-2"}
                    style={style}
                    role="progressbar"
                  >
                    <p style={{ fontSize: "10px" }}>{completion} %</p>
                  </div>
                </span>
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-1 mt-4">
                  {modules.length > 0 ? (
                    <div className="h-9rem overflow-auto">
                      <StatsProgression modules={modules} />
                    </div>
                  ) : (
                    <ElementNotFound message="Aucun module complété pour le moment" />
                  )}
                </div>
              </div>
            </BoxWrapper>
          </div>
        </div>

        {tokenStats ? (
          <BoxWrapper>
            <TokensUsed tokenStats={tokenStats} />
          </BoxWrapper>
        ) : null}
      </div>
    </article>
  );
}
