/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useMemo } from "react";

import StudentCard from "../../components/teacher/student-data/student-card";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import useTeacher from "./hooks/useTeacher";
import UserConnection from "../../components/stats/user-connection";
export default function UserData() {
  const { studentId } = useParams();
  const {
    student,
    parcours,
    parcoursCompletion,
    imageUrl,
    getTotalConnectionTime,
  } = useTeacher(studentId!);

  const totalConnectionTime = useMemo(() => {
    return getTotalConnectionTime();
  }, [getTotalConnectionTime]);

  const classImage: React.CSSProperties = {
    backgroundImage: `url(${imageUrl})`,
    width: "100%",
    height: "20rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <main className="flex flex-col gap-y-4 mt-4">
      <section style={classImage} />

      {student ? (
        <Wrapper>
          <section className="flex flex-col xl:flex-row gap-4">
            <article className="w-full xl:w-3/12">
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
            {student && student.connectionInfos !== undefined ? (
              <UserConnection
                totalConnectionTime={totalConnectionTime}
                connectionInfos={student.connectionInfos}
                parcoursCompletion={parcoursCompletion}
              />
            ) : null}
          </section>
        </Wrapper>
      ) : null}
    </main>
  );
}
