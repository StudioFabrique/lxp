import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { cn } from "../../utils/cn";
import { gsap, prefersReducedMotion } from "./intro-motion";
import { INTRO_ROLES, type IntroRoleOption } from "./intro-role";

type Props = {
  role: IntroRoleOption;
  /** Initiales de l'utilisateur, affichées dans le halo d'analyse. */
  initials: string;
  onDone: () => void;
};

const HOLD_AFTER_MATCH_MS = 450;
const SPIN_SECONDS = 1.5;
/** La roue répète la liste pour rester remplie de part et d'autre du rôle central. */
const COPIES = 3;
const RING_SIZE = INTRO_ROLES.length * COPIES;
const ROW_HEIGHT = 60;

/** Distance signée, en lignes, entre une ligne de la roue et sa position courante. */
const ringDistance = (row: number, position: number): number =>
  ((((row - position + RING_SIZE / 2) % RING_SIZE) + RING_SIZE) % RING_SIZE) -
  RING_SIZE / 2;

/**
 * Détection du rôle : une roue en perspective défile en ralentissant, sous une
 * loupe lumineuse, jusqu'à s'arrêter sur le rôle de l'utilisateur.
 */
const IntroRoleDetection = ({ role, initials, onDone }: Props) => {
  const targetIndex = INTRO_ROLES.findIndex((item) => item.rank === role.rank);
  const [isMatched, setIsMatched] = useState(false);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);
  const lensRef = useRef<HTMLDivElement>(null);
  const pingRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    // Arrêt sur la copie centrale pour que les lignes voisines existent des deux côtés.
    const stop = INTRO_ROLES.length + targetIndex;
    const place = (position: number) => {
      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const distance = ringDistance(index, position);
        const away = Math.abs(distance);
        gsap.set(row, {
          y: distance * ROW_HEIGHT,
          rotationX: -distance * 26,
          scale: 1 - Math.min(away, 3) * 0.1,
          opacity: Math.max(0, 1 - away * 0.4),
          filter: `blur(${Math.min(away, 3) * 1.1}px)`,
          zIndex: 10 - Math.round(away),
        });
      });
    };
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      setIsMatched(true);
      doneTimer = setTimeout(() => onDoneRef.current(), HOLD_AFTER_MATCH_MS);
    };

    if (prefersReducedMotion()) {
      place(stop);
      gsap.set(lensRef.current, { opacity: 1 });
      finish();
      return () => clearTimeout(doneTimer);
    }

    const wheel = { position: stop - INTRO_ROLES.length * 2 };
    place(wheel.position);
    const timeline = gsap.timeline({ onComplete: finish });
    gsap.set(lensRef.current, { opacity: 0, scaleX: 0.7 });
    gsap.set(haloRef.current, { opacity: 0.6 });
    timeline
      .to(lensRef.current, { opacity: 1, scaleX: 1, duration: 0.3, ease: "power3.out" })
      .to(
        wheel,
        {
          position: stop,
          duration: SPIN_SECONDS,
          ease: "power4.out",
          onUpdate: () => place(wheel.position),
        },
        0.05,
      )
      // Le rôle retenu s'illumine : la loupe se détend en un anneau qui se dissipe.
      .fromTo(
        pingRef.current,
        { opacity: 0.7, scale: 1 },
        { opacity: 0, scale: 1.18, duration: 0.5, ease: "power2.out" },
        SPIN_SECONDS + 0.05,
      )
      .to(
        lensRef.current,
        { scale: 1.04, duration: 0.18, ease: "power2.out" },
        SPIN_SECONDS + 0.05,
      )
      .to(lensRef.current, { scale: 1, duration: 0.3, ease: "back.out(2)" })
      .to(haloRef.current, { opacity: 1, scale: 1.08, duration: 0.3 }, SPIN_SECONDS);

    return () => {
      timeline.kill();
      clearTimeout(doneTimer);
    };
  }, [targetIndex]);

  return (
    <div className="grid h-full place-items-center p-6">
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Halo d'analyse autour des initiales : il tourne tant que le rôle n'est pas trouvé. */}
        <div className="relative grid size-20 place-items-center">
          <div
            ref={haloRef}
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary",
              isMatched
                ? "border-primary"
                : "animate-spin motion-reduce:animate-none",
            )}
          />
          <span className="grid size-14 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-content shadow-lg shadow-primary/30">
            {isMatched ? (
              <Check className="size-6" aria-hidden="true" />
            ) : (
              initials || "?"
            )}
          </span>
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold">
          {isMatched ? "Rôle détecté" : "Analyse de votre profil"}
        </h1>
        <p className="mt-1 min-h-6 text-center text-base-content/70">
          {isMatched
            ? `Voici votre espace ${role.label.toLowerCase()}.`
            : "Nous préparons l'espace qui vous correspond."}
        </p>
        <p className="sr-only" role="status">
          {isMatched ? `Rôle détecté : ${role.label}` : "Détection en cours"}
        </p>

        {/* Roue de rôles : décorative, le résultat est annoncé par le statut ci-dessus. */}
        <div
          aria-hidden="true"
          className="relative mt-8 h-[19rem] w-full max-w-sm overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
          style={{ perspective: "800px" }}
        >
          <div
            ref={lensRef}
            className={cn(
              "absolute inset-x-0 top-1/2 -mt-[1.875rem] h-[3.75rem] rounded-box border-2 border-primary bg-primary/10 shadow-[0_0_40px] shadow-primary/30 transition-colors duration-300",
              isMatched && "bg-primary/20",
            )}
          />
          <div
            ref={pingRef}
            className="absolute inset-x-0 top-1/2 -mt-[1.875rem] h-[3.75rem] rounded-box border-2 border-primary opacity-0"
          />
          <ul className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {Array.from({ length: RING_SIZE }, (_, row) => {
              const item = INTRO_ROLES[row % INTRO_ROLES.length];
              const Icon = item.icon;
              return (
                <li
                  key={row}
                  ref={(element) => {
                    rowRefs.current[row] = element;
                  }}
                  className="absolute inset-x-6 top-1/2 -mt-[1.5rem] flex h-12 items-center gap-3 px-4 text-lg font-medium will-change-transform"
                >
                  <Icon className="size-5 shrink-0" />
                  {item.label}
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
