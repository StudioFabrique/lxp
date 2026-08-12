import { useMemo } from "react";
import { useParams } from "react-router";
import { bgImageGradient } from "../../../utils/helpers/color-helpers";
import Header from "../../../components/headers/Header";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import UserConnection from "../components/user-data/UserConnection";
import useTeacher from "../hooks/useTeacher";

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
        <BoxWrapper>
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
        </BoxWrapper>
      ) : null}
    </main>
  );
}
