import { motion, useReducedMotion } from "motion/react";
import Confetti from "react-confetti";
import Modal from "../../../components/UI/modal/modal";
import type Skill from "../../../utils/interfaces/skill";
import SkillBadge from "../../../components/skills/skill-badge";
import SkillModules from "../../../components/skills/skill-modules";

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
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
          aria-hidden="true"
        >
          <Confetti recycle={false} numberOfPieces={400} />
        </div>
      )}
      <div className="py-8 text-center">
        <p className="text-lg font-semibold">Félicitations, vous avez terminé tous les cours de ce module !</p>
        {badges.length === 0 && <p className="mt-4">Aucun badge n’est associé à ce module.</p>}
        {[
          { title: "Badges obtenus", items: badges.filter((badge) => badge.isEarned) },
          { title: "Badges restant à obtenir", items: badges.filter((badge) => !badge.isEarned) },
        ].filter((group) => group.items.length > 0).map((group) => (
          <section key={group.title} className="mt-6">
            <h4 className="text-lg font-semibold">{group.title}</h4>
            <ul aria-label={group.title} className="grid gap-6 py-6 sm:grid-cols-2">
              {group.items.map((badge, index) => (
                <motion.li
                  key={badge.id}
                  className="flex min-w-0 flex-col items-center gap-3"
                  initial={reduceMotion ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.9,
                          delay: index * 0.15,
                          ease: easeOutElastic,
                        }
                  }
                >
                  <SkillBadge skill={badge} size="large" inModal />
                  <span className="text-sm font-medium first-letter:uppercase">
                    {badge.description}
                  </span>
                  <SkillModules skill={badge} onNavigate={onClose} />
                </motion.li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
}
