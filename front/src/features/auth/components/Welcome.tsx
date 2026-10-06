import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import WelcomeActions from "./WelcomeActions";
import AuthOnboardingChatbot from "./AuthOnboardingChatbot";

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
      transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="mx-auto max-w-md"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}>
        <h1 className="text-2xl font-bold text-base-content">
          Bienvenue sur ANDRIA
        </h1>
      </motion.div>
      <div className="mx-auto mt-5 w-full max-w-xl">
        <AuthOnboardingChatbot
          introduction={false}
          delay={1.1}
          message="Configurez votre plateforme en créant le premier compte. Il vous permettra de gérer les paramètres de l’instance et les accès à ANDRIA."
        />
      </div>
      <motion.button
        type="button"
        className="btn btn-primary mt-9 w-full gap-2 rounded-lg normal-case text-base-100"
        onClick={onNext}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Commencer <ArrowRight className="size-4" aria-hidden="true" />
      </motion.button>
      <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 1.95, ease: [0.22, 1, 0.36, 1] }}>
        <WelcomeActions />
      </motion.div>
    </motion.section>
  );
};

export default Welcome;
