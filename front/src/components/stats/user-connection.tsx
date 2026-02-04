import { ReactNode } from "react";
import Wrapper from "../UI/wrapper/wrapper.component";
import StatsConnection from "./stats-connection";
import StudentCard from "../teacher/student-data/student-card";
import Parcours from "../../utils/interfaces/parcours";
import User from "../../utils/interfaces/user";

interface UserConnectionProps {
  connectionInfos: Array<{ lastConnection: string; duration: number }>;
  totalConnectionTime: number;
  parcoursCompletion: number;
  student: User;
  parcours: Parcours | null;
  totalTokens: number;
}

export default function UserConnection({
  connectionInfos,
  totalConnectionTime,
  parcoursCompletion,
  student,
  parcours,
  totalTokens,
}: UserConnectionProps) {
  const style = {
    "--value": parcoursCompletion,
    "--size": "5rem",
    "--thickness": "8px",
  } as React.CSSProperties;

  return (
    <article className="flex-1">
      <div className="flex flex-col gap-y-4">
        <span className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsUser label="Complétion du parcours">
            <div
              className="flex items-center radial-progress text-primary md:mt-0 mt-2"
              style={style}
              role="progressbar"
            >
              <p className="font-bold text-xs">{parcoursCompletion} %</p>
            </div>
          </StatsUser>
          <StatsUser label="Temps de connexion">
            {totalConnectionTime} heures
          </StatsUser>
          <StatsUser label="Token utilisés">
            {totalTokens} tokens utilisés
          </StatsUser>
        </span>
        <span className="flex gap-4 flex-col lg:flex-row">
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
          <div className=" md:flex-1">
            <Wrapper>
              {connectionInfos ? (
                <StatsConnection connectionTime={connectionInfos!} />
              ) : null}
            </Wrapper>
          </div>
        </span>
      </div>
    </article>
  );
}

interface StatsUserProps {
  label: string;
  children: ReactNode;
}

export function StatsUser({ label, children }: StatsUserProps) {
  return (
    <Wrapper>
      <div className="h-full md:flex-row flex flex-col md:justify-between items-center gap-x-2 gap-y-2">
        <h2 className="font-bold text-xl">{label}</h2>
        <div className="h-full flex items-center">{children}</div>
      </div>
    </Wrapper>
  );
}
