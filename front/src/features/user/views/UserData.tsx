import { useParams } from "react-router";
import { bgImageGradient } from "../../../utils/helpers/color-helpers";
import Header from "../../../components/headers/Header";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import Loader from "../../../components/loaders/Loader";
import ElementNotFound from "../../../components/UI/element-not-found";
import UserConnection from "../components/user-data/UserConnection";
import IndicatorsGrid from "../components/user-data/IndicatorsGrid";
import IndicatorsPrediction from "../components/user-data/IndicatorsPrediction";
import useTeacher from "../hooks/useTeacher";
import useStudentIndicators from "../hooks/useStudentIndicators";

export default function UserData() {
  const { studentId } = useParams();
  const { student, parcours, imageUrl, isLoading, isError } = useTeacher(
    studentId!,
  );
  const indicatorsQuery = useStudentIndicators(studentId!);

  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(imageUrl),
    width: "100%",
    height: "20rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <main className="flex flex-col gap-y-4">
      <Header title="Informations de l'apprenant" />
      <section style={classImage} />

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ElementNotFound message="Impossible de charger les informations de cet apprenant." />
      ) : student ? (
        <>
          <BoxWrapper>
            <section className="flex flex-col xl:flex-row gap-4">
              <UserConnection
                student={student}
                parcours={parcours}
                tokenStats={student.promptStats}
                progression={
                  indicatorsQuery.indicators?.parcours_progression ?? null
                }
              />
            </section>
          </BoxWrapper>

          <BoxWrapper>
            <IndicatorsGrid
              indicators={indicatorsQuery.indicators}
              range={indicatorsQuery.range}
              isLoading={indicatorsQuery.isLoading}
              isError={indicatorsQuery.isError}
            />
          </BoxWrapper>

          <BoxWrapper>
            <IndicatorsPrediction
              studentId={studentId!}
              range={indicatorsQuery.range}
              disabled={indicatorsQuery.isLoading || indicatorsQuery.isError}
            />
          </BoxWrapper>
        </>
      ) : null}
    </main>
  );
}
