import { ReactNode } from "react";
import Wrapper from "../UI/wrapper/wrapper.component";
import StatsConnection, { TokensUsed } from "./stats-connection";
import StudentCard from "../teacher/student-data/student-card";
import Parcours from "../../utils/interfaces/parcours";
import User from "../../utils/interfaces/user";
import { ProgressionData } from "../../views/teacher/hooks/useTeacher";
import ElementNotFound from "../UI/element-not-found";
import StatsProgression from "./stats-progression";

export type TokenStat = {
  _id: string;
  date: string;
  tokensUsed: number;
};

interface UserConnectionProps {
  connectionInfos: Array<{ lastConnection: string; duration: number }>;
  totalConnectionTime: number;
  parcoursCompletion: number;
  student: User;
  parcours: Parcours | null;
  totalTokens: number;
  tokenStats?: TokenStat[];
  completionModules: ProgressionData[] | null;
}

export default function UserConnection({
  connectionInfos,
  totalConnectionTime,
  parcoursCompletion,
  student,
  parcours,
  totalTokens,
  tokenStats,
  completionModules,
}: UserConnectionProps) {
  const style = {
    "--value": parcoursCompletion,
    "--size": "3rem",
    "--thickness": "4px",
  } as React.CSSProperties;

  console.log({ completionModules });

  return (
    <article className="flex-1">
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Wrapper>
            <StudentCard
              avatar={student?.avatar}
              firstname={student.firstname}
              lastname={student.lastname}
              email={student.email}
              phoneNumber={student.phoneNumber ?? "Non renseigné"}
              parcours={parcours?.title ?? "Aucun parcours"}
              status={student.isActive ? "Actif" : "Inactif"}
            />
          </Wrapper>
          <div className="col-span-2">
            <Wrapper>
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
                    <p style={{ fontSize: "10px" }}>{parcoursCompletion} %</p>
                  </div>
                </span>
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-1 mt-4">
                  {completionModules && completionModules.length > 0 ? (
                    <>
                      <div className="h-36 overflow-auto">
                        <StatsProgression
                          completionModules={completionModules}
                          parcoursCompletion={parcoursCompletion}
                        />
                        <div className="flex gap-x-4 items-center justify-between"></div>{" "}
                      </div>
                    </>
                  ) : (
                    <ElementNotFound message="Aucun module complété pour le moment" />
                  )}
                </div>
              </div>
            </Wrapper>
          </div>
        </div>
        <span className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsUser label="Temps de connexion">
            {totalConnectionTime} heures
          </StatsUser>
          <StatsUser label="Token utilisés">
            {totalTokens} tokens utilisés
          </StatsUser>
        </span>
        <span className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Wrapper>
            {connectionInfos ? (
              <StatsConnection connectionTime={connectionInfos!} />
            ) : null}
          </Wrapper>
          <Wrapper>
            {tokenStats ? <TokensUsed tokenStats={tokenStats!} /> : null}
          </Wrapper>
        </span>
      </div>
    </article>
  );
}

interface StatsUserProps {
  label: string;
  children: ReactNode;
  positionY?: "top" | "center" | "bottom";
}

function StatsUser({ label, children, positionY = "center" }: StatsUserProps) {
  return (
    <Wrapper>
      <div
        className={`h-full md:flex-row flex flex-col md:justify-between ${
          positionY === "top"
            ? "items-start"
            : positionY === "bottom"
              ? "items-end"
              : "items-center"
        } gap-x-2 gap-y-2`}
      >
        <h2 className="font-bold text-xl">{label}</h2>
        <div
          className={`h-full flex ${positionY === "top" ? "items-start" : positionY === "bottom" ? "items-end" : "items-center"}`}
        >
          {children}
        </div>
      </div>
    </Wrapper>
  );
}
