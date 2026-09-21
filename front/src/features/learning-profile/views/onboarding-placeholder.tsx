import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";

export function LearningChoiceCardsPlaceholder() {
  return (
    <PageWrapper aria-busy="true" aria-label="Chargement de l’onboarding">
      <Header title="Personnalisons votre accompagnement" />
      <div className="skeleton h-12 w-full" />
      <div className="skeleton mx-auto h-96 w-full max-w-3xl rounded-2xl" />
    </PageWrapper>
  );
}

