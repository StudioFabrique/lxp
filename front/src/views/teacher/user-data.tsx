/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import { ReactNode, useCallback, useEffect, useState } from "react";
import StudentCard from "../../components/teacher/student-data/student-card";
import User from "../../utils/interfaces/user";
import Parcours from "../../utils/interfaces/parcours";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import StatsConnection from "../../components/teacher/student-data/stats-connection";

export default function UserData() {
  const { studentId } = useParams();
  const { sendRequest } = useHttp();
  const [student, setStudent] = useState<User | null>(null);
  const [parcours, setParcours] = useState<Parcours | null>(null);

  const getStudentData = useCallback(() => {
    const applyData = (data: any) => {
      setStudent(data.user);
      setParcours(data.parcours);
    };
    sendRequest(
      {
        path: `/user/data/${studentId}`,
      },
      applyData
    );
  }, [sendRequest, studentId]);

  useEffect(() => {
    getStudentData();
  }, [getStudentData]);

  return (
    <>
      {student ? (
        <Wrapper>
          <section className="flex gap-4">
            <article className="w-1/6">
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
                  <StatsUser label="Temps de connexion">1h</StatsUser>
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
