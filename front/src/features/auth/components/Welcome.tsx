import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";
import ReleaseNotesCard from "../../../components/UI/ReleaseNotesCard";

type Props = {
  onNext: () => void;
};

const Welcome = ({ onNext }: Props) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="flex w-full flex-1 flex-col text-center"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5 }}
    >
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold text-base-content">
          Bienvenue sur ANDRIA
        </h1>
        <p className="mt-5 text-sm leading-6 text-base-content/70">
          Configurez votre plateforme en créant le premier compte. Il vous
          permettra de gérer les paramètres de l’instance et les accès à ANDRIA.
        </p>
      </div>
      <div className="mt-9 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
        <CursorGlowCard
          autoGlow
          glowColor="accent"
          glowSize={3.2}
          className="h-full bg-primary shadow-sm sm:col-span-2"
        >
          <Link
            to="/demo"
            aria-label="Explorer la démo sans compte ni accès administrateur"
            className="relative flex h-full min-h-28 flex-col justify-center overflow-hidden rounded-xl border border-primary px-5 py-4 text-left text-primary-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="relative z-10 flex items-center gap-2 text-base font-semibold">
              Explorer la démo
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
            <span className="relative z-10 mt-1 block text-sm text-primary-content/75">
              Découvrez la plateforme librement, sans compte.
            </span>
            <Compass
              className="pointer-events-none absolute -bottom-7 right-4 size-28 text-primary-content/10"
              aria-hidden="true"
            />
          </Link>
        </CursorGlowCard>
        <ReleaseNotesCard />
      </div>
      <button
        type="button"
        className="btn btn-primary mb-7 mt-auto w-full gap-2 rounded-lg normal-case text-base-100"
        onClick={onNext}
      >
        Commencer <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </motion.section>
  );
};

export default Welcome;
