/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { ReactNode, useMemo } from "react";

import StudentCard from "../../components/teacher/student-data/student-card";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import StatsConnection from "../../components/teacher/student-data/stats-connection";
import useTeacher from "./hooks/useTeacher";

export default function UserData() {
  const { studentId } = useParams();
  const { student, parcours, getTotalConnectionTime } = useTeacher(studentId!);

  const totalConnectionTime = useMemo(() => {
    return getTotalConnectionTime();
  }, [getTotalConnectionTime]);

  return (
    <>
      {student ? (
        <Wrapper>
          <section className="flex flex-col md:flex-row gap-4">
            <article className="w-full md:w-fit md:min-w-1/6">
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
            </article>
            <article className="flex-1">
              <div className="flex flex-col gap-y-4">
                <span className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <StatsUser label="Complétion Parcours">ND</StatsUser>
                  <StatsUser label="Temps de connexion">
                    {totalConnectionTime}
                  </StatsUser>
                  <StatsUser label="Jours d'absence">0</StatsUser>
                </span>

                <span className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <Wrapper>
                    {student && student.connectionInfos ? (
                      <StatsConnection
                        connectionTime={student.connectionInfos!}
                      />
                    ) : (
                      <p>Aucune statistique de connexion</p>
                    )}
                  </Wrapper>
                  <Wrapper>stats</Wrapper>
                </span>
              </div>
            </article>
          </section>
        </Wrapper>
      ) : null}
    </>
  );
}

interface StatsUserProps {
  label: string;
  children: ReactNode;
}

export function StatsUser({ label, children }: StatsUserProps) {
  return (
    <Wrapper>
      <div className="flex gap-x-4">
        <h2>{label}</h2>
        <div>{children}</div>
      </div>
    </Wrapper>
  );
}
