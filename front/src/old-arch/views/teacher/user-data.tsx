/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router";
import { useMemo } from "react";

import Wrapper from "../../components/UI/wrapper/wrapper.component";
import useTeacher from "./hooks/useTeacher";
import UserConnection from "../../components/stats/user-connection";
import bgImageGradient from "../../utils/bg-image-gradient";
import Header from "../../components/UI/header";

export default function UserData() {
  const { studentId } = useParams();
  const {
    student,
    parcours,
    imageUrl,
    getTotalConnectionTime,
    totaltokens,
    completionModules,
    parcoursCompletion,
  } = useTeacher(studentId!);

  const totalConnectionTime = useMemo(() => {
    return getTotalConnectionTime();
  }, [getTotalConnectionTime]);

  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(imageUrl),
    width: "100%",
    height: "20rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  console.log(student?.promptStats);

  return (
    <main className="flex flex-col gap-y-4">
      <Header title="Informations de l'apprenant" />
      <section style={classImage} />

      {student ? (
        <Wrapper>
          <section className="flex flex-col xl:flex-row gap-4">
            {student && student.connectionInfos !== undefined ? (
              <UserConnection
                student={student}
                parcours={parcours}
                totalConnectionTime={totalConnectionTime}
                connectionInfos={student.connectionInfos}
                totalTokens={totaltokens}
                tokenStats={student.promptStats}
                completionModules={completionModules}
                parcoursCompletion={parcoursCompletion}
              />
            ) : null}
          </section>
        </Wrapper>
      ) : null}
    </main>
  );
}
