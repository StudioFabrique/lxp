import { useEffect } from "react";
import { ArrowUpRight, BookOpen, CalendarDays, ClipboardCheck, Compass, Lightbulb } from "lucide-react";
import { Link } from "react-router";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { scrollToTop } from "../../../utils/helpers/scroll-to-top";

const upcomingFeatures = [
  "Carnet de notes personnel",
  "Forum d’échange",
  "Messagerie avec les tuteurs",
  "Suggestions de contenus personnalisées",
];

const FeaturesList = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <PageWrapper>
      <CursorGlowCard
        autoGlow
        glowColor="accent"
        glowSize={3.2}
        className="bg-secondary"
      >
        <BoxWrapper className="min-h-80 items-center justify-center gap-5 border-secondary bg-transparent px-6 py-14 text-center text-secondary-content sm:px-12">
          <h1 className="text-4xl font-bold sm:text-6xl">Disponible bientôt</h1>
          <p className="max-w-xl text-base sm:text-lg">
            Cette page n’est pas encore accessible. Votre apprentissage continue
            depuis votre tableau de bord.
          </p>
          <Link to="/student/dashboard" className="btn btn-primary mt-2 gap-2">
            Retour au tableau de bord{" "}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </BoxWrapper>
      </CursorGlowCard>

      <div className="grid gap-5 md:grid-cols-2">
        <BoxWrapper className="h-auto gap-3">
          <div className="flex gap-2 items-center">
            <Lightbulb className="size-6 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Prochainement</h2>
          </div>
          <ul className="grid gap-2 text-sm text-base-content/70">
            {upcomingFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span
                  className="size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </BoxWrapper>
        <BoxWrapper className="h-auto gap-3">
          <div className="flex gap-2 items-center">
            <BookOpen className="size-6 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Reprendre mon apprentissage</h2>
          </div>
          <p className="text-sm text-base-content/70">
            Retrouvez vos contenus et poursuivez là où vous en étiez.
          </p>
          <Link
            to="/student/dashboard"
            className="btn btn-outline btn-primary btn-sm mt-auto self-end gap-2"
          >
            Reprendre mes cours <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </BoxWrapper>
      </div>

      <BoxWrapper className="h-auto gap-4">
        <div className="flex items-center gap-2">
          <Compass className="size-6 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Explorer mon espace</h2>
        </div>
        <p className="text-sm text-base-content/70">
          Accédez directement aux espaces disponibles pour organiser votre apprentissage.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/student/parcours" className="btn btn-outline btn-primary gap-2">
            <BookOpen className="size-4" aria-hidden="true" /> Mes parcours
          </Link>
          <Link to="/student/calendrier" className="btn btn-outline btn-primary gap-2">
            <CalendarDays className="size-4" aria-hidden="true" /> Calendrier
          </Link>
          <Link to="/student/remises-evaluations" className="btn btn-outline btn-primary gap-2">
            <ClipboardCheck className="size-4" aria-hidden="true" /> Remises et évaluations
          </Link>
        </div>
      </BoxWrapper>
    </PageWrapper>
  );
};

export default FeaturesList;
