import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { cn } from "../../utils/cn";
import { gsap, prefersReducedMotion } from "./intro-motion";
import {
  INTRO_ROLES,
  buildIntroRoleSweep,
  type IntroRoleOption,
} from "./intro-role";

type Props = {
  role: IntroRoleOption;
  onDone: () => void;
};

const HOLD_AFTER_MATCH_MS = 450;

/**
 * Détection du rôle : un sélecteur parcourt la liste des rôles en ralentissant
 * jusqu'à s'arrêter sur celui de l'utilisateur.
 */
const IntroRoleDetection = ({ role, onDone }: Props) => {
  const targetIndex = INTRO_ROLES.findIndex((item) => item.rank === role.rank);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMatched, setIsMatched] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const list = listRef.current;
    const selector = selectorRef.current;
    if (!list || !selector) return;

    const rows = Array.from(list.children) as HTMLElement[];
    const place = (index: number) => ({
      y: rows[index].offsetTop,
      height: rows[index].offsetHeight,
    });
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      setActiveIndex(targetIndex);
      setIsMatched(true);
      doneTimer = setTimeout(() => onDoneRef.current(), HOLD_AFTER_MATCH_MS);
    };

    if (prefersReducedMotion()) {
      gsap.set(selector, { ...place(targetIndex), opacity: 1 });
      finish();
      return () => clearTimeout(doneTimer);
    }

    const sweep = buildIntroRoleSweep(rows.length, targetIndex);
    const timeline = gsap.timeline({ onComplete: finish });
    gsap.set(selector, { ...place(sweep[0]), opacity: 0, scale: 0.96 });
    timeline.to(selector, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" });
    sweep.forEach((index, step) => {
      // Le pas s'allonge au fil du parcours : le sélecteur ralentit avant de s'arrêter.
      const progress = step / (sweep.length - 1);
      timeline.to(selector, {
        ...place(index),
        duration: 0.09 + progress ** 2 * 0.22,
        ease: step === sweep.length - 1 ? "back.out(1.6)" : "power2.inOut",
        onStart: () => setActiveIndex(index),
      });
    });
    // Petit rebond sur le rôle retenu avant la suite.
    timeline.to(selector, { scale: 1.04, duration: 0.12, ease: "power2.out" });
    timeline.to(selector, { scale: 1, duration: 0.2, ease: "back.out(2)" });

    return () => {
      timeline.kill();
      clearTimeout(doneTimer);
    };
  }, [targetIndex]);

  return (
    <div className="grid h-full place-items-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold">
          Détection de votre rôle
        </h1>
        <p className="mt-1 min-h-6 text-center text-base-content/70">
          {isMatched
            ? "Votre espace est prêt à être présenté."
            : "Nous préparons l'espace qui vous correspond."}
        </p>
        <p className="sr-only" role="status">
          {isMatched ? `Rôle détecté : ${role.label}` : "Détection en cours"}
        </p>

        <div className="relative mt-8">
          <div
            ref={selectorRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 rounded-box border-2 border-primary opacity-0 shadow-lg shadow-primary/30 transition-colors duration-300",
              isMatched ? "bg-primary/20" : "bg-primary/10",
            )}
          />
          <ul ref={listRef} className="flex flex-col gap-3">
            {INTRO_ROLES.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeIndex === index;
              return (
                <li
                  key={item.rank}
                  className={cn(
                    "flex items-center gap-3 rounded-box border border-base-300 bg-base-100 px-4 py-3 transition-colors duration-200",
                    isActive && "text-primary",
                    isMatched && !isActive && "opacity-50",
                  )}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {isMatched && isActive ? (
                    <Check className="size-5 shrink-0" aria-hidden="true" />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntroRoleDetection;
