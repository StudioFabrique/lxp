import { ReactNode } from "react";
import Wrapper from "../UI/wrapper/wrapper.component";
import StatsConnection from "./stats-connection";

interface UserConnectionProps {
  connectionInfos: Array<{ lastConnection: string; duration: number }>;
  totalConnectionTime: number;
  parcoursCompletion: number;
}

export default function UserConnection({
  connectionInfos,
  totalConnectionTime,
  parcoursCompletion,
}: UserConnectionProps) {
  const style = {
    "--value": parcoursCompletion,
    "--size": "5rem",
    "--thickness": "8px",
  } as React.CSSProperties;

  return (
    <article className="flex-1">
      <div className="flex flex-col gap-y-4">
        <span className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsUser label="Complétion Parcours">
            <div
              className="radial-progress text-primary"
              style={style}
              role="progressbar"
            >
              <p className="font-bold text-xs">{parcoursCompletion} %</p>
            </div>
          </StatsUser>
          <StatsUser label="Temps de connexion">
            {totalConnectionTime} heures
          </StatsUser>
          <StatsUser label="Jours d'absence">0</StatsUser>
        </span>

        <span className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Wrapper>
            {connectionInfos ? (
              <StatsConnection connectionTime={connectionInfos!} />
            ) : null}
          </Wrapper>
          <Wrapper>stats</Wrapper>
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
      <div className="h-full flex justify-between items-center gap-x-4">
        <h2 className="font-bold text-xl">{label}</h2>
        <div>{children}</div>
      </div>
    </Wrapper>
  );
}
