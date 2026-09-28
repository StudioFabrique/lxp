import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import WelcomeActions from "./WelcomeActions";

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
      <button
        type="button"
        className="btn btn-primary mt-9 w-full gap-2 rounded-lg normal-case text-base-100"
        onClick={onNext}
      >
        Commencer <ArrowRight className="size-4" aria-hidden="true" />
      </button>
      <WelcomeActions />
    </motion.section>
  );
};

export default Welcome;
