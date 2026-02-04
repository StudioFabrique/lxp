import { ReactNode } from "react";
import Wrapper from "../UI/wrapper/wrapper.component";
import StatsConnection, { TokensUsed } from "./stats-connection";
import StudentCard from "../teacher/student-data/student-card";
import Parcours from "../../utils/interfaces/parcours";
import User from "../../utils/interfaces/user";

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
}

export default function UserConnection({
  connectionInfos,
  totalConnectionTime,
  parcoursCompletion,
  student,
  parcours,
  totalTokens,
  tokenStats,
}: UserConnectionProps) {
  const style = {
    "--value": parcoursCompletion,
    "--size": "5rem",
    "--thickness": "8px",
  } as React.CSSProperties;

  console.log({ tokenStats });

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
            <StatsUser label="Complétion du parcours" positionY="top">
              <span className="flex justify-center items-center">
                <div
                  className="radial-progress text-primary md:mt-0 mt-2"
                  style={style}
                  role="progressbar"
                >
                  <p className="font-bold text-xs">{parcoursCompletion} %</p>
                </div>
              </span>
            </StatsUser>
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

export function StatsUser({
  label,
  children,
  positionY = "center",
}: StatsUserProps) {
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
