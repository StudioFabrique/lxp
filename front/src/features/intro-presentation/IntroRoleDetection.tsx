import { useEffect, useRef, useState } from "react";

import { gsap, prefersReducedMotion } from "./intro-motion";
import { INTRO_ROLES, type IntroRoleOption } from "./intro-role";

type Props = {
  role: IntroRoleOption;
  onDone: () => void;
};

const HOLD_AFTER_MATCH_MS = 600;
const SPIN_SECONDS = 1.9;
/** La roue répète la liste pour rester remplie de part et d'autre du rôle central. */
const COPIES = 3;
const RING_SIZE = INTRO_ROLES.length * COPIES;
const ROW_HEIGHT = 60;
/** Amplitude, en pixels, de l'errance du halo avant qu'il se pose sur le rôle. */
const GLOW_WANDER_X = 90;
const GLOW_WANDER_Y = 80;

/** Distance signée, en lignes, entre une ligne de la roue et sa position courante. */
const ringDistance = (row: number, position: number): number =>
  ((((row - position + RING_SIZE / 2) % RING_SIZE) + RING_SIZE) % RING_SIZE) -
  RING_SIZE / 2;

/**
 * Détection du rôle : seule la roue est affichée. Elle défile en ralentissant
 * autour d'un halo flou inspiré de `CursorGlowCard` (aucun cadre), puis elle
 * s'arrête sur le rôle de l'utilisateur.
 */
const IntroRoleDetection = ({ role, onDone }: Props) => {
  const targetIndex = INTRO_ROLES.findIndex((item) => item.rank === role.rank);
  const [isMatched, setIsMatched] = useState(false);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);
  const wheelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
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
          opacity: Math.max(0, 1 - away * 0.38),
          filter: `blur(${Math.min(away, 3) * 1.6}px)`,
          zIndex: 10 - Math.round(away),
        });
      });
      // Le halo erre sur la liste tant que la roue tourne ; l'amplitude est nulle à l'arrêt.
      const remaining = Math.min(1, Math.abs(stop - position) / INTRO_ROLES.length);
      gsap.set(glowRef.current, {
        x: Math.sin(position * 1.7) * GLOW_WANDER_X * remaining,
        y: Math.sin(position * 2.3 + 1) * GLOW_WANDER_Y * remaining,
      });
    };
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      setIsMatched(true);
      doneTimer = setTimeout(() => onDoneRef.current(), HOLD_AFTER_MATCH_MS);
    };

    if (prefersReducedMotion()) {
      place(stop);
      gsap.set(glowRef.current, { opacity: 1 });
      gsap.set(rowRefs.current[stop], { color: "var(--color-primary-content)", fontWeight: 600 });
      gsap.set(pillRef.current, { opacity: 1, scaleX: 1 });
      finish();
      return () => clearTimeout(doneTimer);
    }

    const wheel = { position: stop - INTRO_ROLES.length * 2 };
    place(wheel.position);
    gsap.set(glowRef.current, { opacity: 0, scale: 0.6 });
    const target = rowRefs.current[stop];
    gsap.set(burstRef.current, { opacity: 0, scale: 0.6 });
    gsap.set(pillRef.current, { opacity: 0, scaleX: 0.5 });
    const timeline = gsap.timeline({ onComplete: finish });
    timeline
      // Apparition : la roue se densifie depuis le flou, le halo s'étend.
      .fromTo(
        wheelRef.current,
        { opacity: 0, filter: "blur(18px)" },
        { opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power2.out" },
        0,
      )
      .to(glowRef.current, { opacity: 0.7, scale: 1, duration: 0.8, ease: "power2.out" }, 0.1)
      .to(
        wheel,
        {
          position: stop,
          duration: SPIN_SECONDS,
          ease: "power4.out",
          onUpdate: () => place(wheel.position),
        },
        0.2,
      )
      // Le halo s'est posé sur le rôle retenu : il s'intensifie, le texte se colore et une onde floue se dissipe.
      .to(glowRef.current, { opacity: 1, scale: 1.25, duration: 0.5, ease: "power2.out" }, SPIN_SECONDS)
      // Pastille pleine déployée derrière le rôle retenu, dont le texte passe en couleur de contenu.
      .to(pillRef.current, { opacity: 1, scaleX: 1, duration: 0.45, ease: "back.out(1.6)" }, SPIN_SECONDS)
      .to(target, { color: "var(--color-primary-content)", fontWeight: 600, duration: 0.3 }, SPIN_SECONDS + 0.1)
      .fromTo(
        burstRef.current,
        { opacity: 0.7, scale: 0.7 },
        { opacity: 0, scale: 1.7, duration: 0.8, ease: "power2.out" },
        SPIN_SECONDS + 0.1,
      );

    return () => {
      timeline.kill();
      clearTimeout(doneTimer);
    };
  }, [targetIndex]);

  return (
    <div className="grid h-full place-items-center overflow-hidden p-6">
      <p className="sr-only" role="status">
        {isMatched ? `Rôle détecté : ${role.label}` : "Détection du rôle en cours"}
      </p>

      {/* Roue de rôles : décorative, le résultat est annoncé par le statut ci-dessus. */}
      <div
        ref={wheelRef}
        aria-hidden="true"
        className="relative h-[19rem] w-[44rem] max-w-full [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
        style={{ perspective: "800px" }}
      >
        {/* Halos flous sans bordure : ils sont centrés par flex, GSAP ne gère que leur décalage. */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div
            ref={glowRef}
            className="h-16 w-80 rounded-full bg-primary/30 blur-2xl"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div
            ref={burstRef}
            className="h-20 w-96 rounded-full bg-primary/40 opacity-0 blur-3xl"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div
            ref={pillRef}
            className="h-12 w-72 rounded-full bg-primary opacity-0 shadow-lg shadow-primary/40"
          />
        </div>
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
                className="absolute inset-x-0 top-1/2 -mt-[1.5rem] mx-auto flex h-12 w-72 items-center gap-3 px-4 text-xl font-medium origin-left will-change-transform"
              >
                <Icon className="size-5 shrink-0" />
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default IntroRoleDetection;
