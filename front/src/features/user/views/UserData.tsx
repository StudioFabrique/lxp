import { useState } from "react";
import { useParams } from "react-router";
import { bgImageGradient } from "../../../utils/helpers/color-helpers";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import Loader from "../../../components/loaders/Loader";
import ElementNotFound from "../../../components/UI/element-not-found";
import UserConnection from "../components/user-data/UserConnection";
import IndicatorsGrid from "../components/user-data/IndicatorsGrid";
import PredictionButton from "../components/user-data/PredictionButton";
import PredictionPanel from "../components/user-data/PredictionPanel";
import useTeacher from "../hooks/useTeacher";
import useStudentIndicators from "../hooks/useStudentIndicators";
import useStudentPrediction from "../hooks/useStudentPrediction";
import AnalysisFeedbackForm from "../components/user-data/AnalysisFeedbackForm";
import AnalysisHistory from "../components/user-data/AnalysisHistory";
import DeclaredLearningProfile from "../components/user-data/DeclaredLearningProfile";
import LinkPreview from "../../profile/components/information/LinkPreview";

export default function UserData() {
  const { studentId } = useParams();
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const { student, parcours, imageUrl, learningProfile, isLoading, isError } = useTeacher(
    studentId!,
  );
  const indicatorsQuery = useStudentIndicators(studentId!);
  // L'analyse porte sur la fenêtre des indicateurs affichés, pour que le
  // formateur juge sur exactement ce qu'il a sous les yeux.
  const predictionQuery = useStudentPrediction(
    studentId!,
    indicatorsQuery.range,
  );

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
    <PageWrapper as="main">
      <Header title="Informations de l'apprenant">
        <PredictionButton
          onAnalyze={() => predictionQuery.predict()}
          isPending={predictionQuery.isPending}
          disabled={indicatorsQuery.isLoading || indicatorsQuery.isError}
          hasResult={predictionQuery.prediction !== null}
          dailyLimitReached={dailyLimitReached}
        />
      </Header>

      {/* Le résultat se lit avant tout le reste : c'est ce qui décide d'un
          accompagnement, les indicateurs détaillés viennent l'étayer ensuite. */}
      {predictionQuery.prediction ? (
        <BoxWrapper>
          <PredictionPanel prediction={predictionQuery.prediction} />
          <div className="mt-4 flex justify-end">
            <AnalysisFeedbackForm key={predictionQuery.prediction.analysisId} prediction={predictionQuery.prediction} />
          </div>
        </BoxWrapper>
      ) : null}

      <BoxWrapper><AnalysisHistory key={studentId} studentId={studentId!} onDailyAnalysisChange={setDailyLimitReached} /></BoxWrapper>

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

          <DeclaredLearningProfile data={learningProfile} />
          <BoxWrapper>
            <div className="grid gap-6 sm:grid-cols-2">
              <section><h2 className="text-lg font-bold">Mes passions</h2>{student.hobbies?.length ? <ul className="mt-2 flex flex-wrap gap-2">{student.hobbies.map((hobby) => <li key={hobby._id ?? hobby.title} className="rounded-lg border border-base-300 bg-base-200 px-3 py-1.5 text-sm">{hobby.title}</li>)}</ul> : <p className="text-sm text-base-content/60">Aucune passion renseignée.</p>}</section>
              <section><h2 className="text-lg font-bold">Mes liens</h2>{student.links?.some((link) => /^https?:\/\//i.test(link.url)) ? <ul className="mt-2 space-y-2">{student.links.filter((link) => /^https?:\/\//i.test(link.url)).map((link) => <li key={link._id ?? link.url} className="rounded-lg border border-base-300 bg-base-200 px-3 py-2"><LinkPreview link={link} /></li>)}</ul> : <p className="text-sm text-base-content/60">Aucun lien renseigné.</p>}</section>
            </div>
          </BoxWrapper>

          <BoxWrapper>
            <IndicatorsGrid
              indicators={indicatorsQuery.indicators}
              range={indicatorsQuery.range}
              isLoading={indicatorsQuery.isLoading}
              isError={indicatorsQuery.isError}
            />
          </BoxWrapper>
        </>
      ) : null}
    </PageWrapper>
  );
}
