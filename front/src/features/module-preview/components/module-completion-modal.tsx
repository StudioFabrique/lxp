import { motion, useReducedMotion } from "motion/react";
import Confetti from "react-confetti";
import Modal from "../../../components/UI/modal/modal";
import type Skill from "../../../utils/interfaces/skill";

function easeOutElastic(value: number) {
  if (value === 0 || value === 1) return value;
  return (
    Math.pow(2, -10 * value) *
      Math.sin((value * 10 - 0.75) * ((2 * Math.PI) / 3)) +
    1
  );
}

type Props = {
  moduleTitle: string;
  badges: Skill[];
  onClose: () => void;
};

export default function ModuleCompletionModal({
  moduleTitle,
  badges,
  onClose,
}: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <Modal
      title={`Le module « ${moduleTitle} » est terminé !`}
      rightLabel="Continuer"
      onRightClick={onClose}
      onMinimizeClick={onClose}
      modalBoxStyle="relative isolate w-11/12 max-w-3xl"
    >
      {!reduceMotion && (
        <Confetti
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: -1 }}
          recycle={false}
          numberOfPieces={400}
          aria-hidden="true"
        />
      )}
      <div className="py-8 text-center">
        <p className="text-lg font-semibold">Félicitations pour vos badges obtenus !</p>
        <ul aria-label="Badges obtenus" className="flex flex-wrap justify-center gap-8 px-4 py-10">
          {badges.map((badge, index) => (
            <motion.li
              key={badge.id}
              className="flex w-36 flex-col items-center gap-3"
              initial={reduceMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.9,
                      delay: index * 0.9,
                      ease: easeOutElastic,
                    }
              }
            >
              <img
                src={badge.badge}
                alt={badge.description}
                className="size-28 object-contain"
              />
              <span className="text-sm font-medium first-letter:uppercase">
                {badge.description}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
