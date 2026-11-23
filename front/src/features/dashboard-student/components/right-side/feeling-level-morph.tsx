import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useReducedMotion } from "motion/react";
import { iconSizeStyle } from "../../../../utils/icon-size-style";

gsap.registerPlugin(MorphSVGPlugin);

type FeelingLevelMorphProps = {
  value: number;
  size?: number;
};

/**
 * Tracés des cinq niveaux (orage, pluie, nuage pluvieux, éclaircies, soleil).
 * MorphSVG exige des tracés compatibles : ils sont repris tels quels de la
 * séquence HyperFrames du showcase, où le morphing a été validé.
 */
const LEVEL_PATHS: readonly string[] = [
  "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973 M13 12l-3 5h4l-3 5",
  "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242 M16 14v6 M8 14v6 M12 16v6",
  "M12 2v2 M4.93 4.93l1.41 1.41 M20 12h2 M19.07 4.93l-1.41 1.41 M15.947 12.65a4 4 0 0 0-5.925-4.128 M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24 M11 20v2 M7 19v2",
  "M12 2v2 M4.93 4.93l1.41 1.41 M20 12h2 M19.07 4.93l-1.41 1.41 M15.947 12.65a4 4 0 0 0-5.925-4.128 M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z",
  "M8 12.0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41",
];

/** Couches empilées en Z qui donnent le relief ; la 0 est la face avant. */
const LAYER_DEPTHS: readonly number[] = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

const clampLevel = (value: number): number =>
  Math.min(5, Math.max(1, Math.round(value)));

/**
 * Pictogramme du ressenti en relief : à chaque changement de niveau, le tracé
 * se déforme (MorphSVG) vers le nouveau pictogramme pendant que l'ensemble
 * fait un tour complet sur lui-même avec un léger bond vers l'avant.
 */
const FeelingLevelMorph = ({ value, size = 10 }: FeelingLevelMorphProps) => {
  const reduceMotion = useReducedMotion();
  const level = clampLevel(value);
  // Le tracé initial est figé : ensuite, seul GSAP écrit l'attribut `d`, pour
  // que React ne vienne pas l'écraser en plein morphing.
  const [initialLevel] = useState(level);
  const iconRef = useRef<HTMLDivElement>(null);
  // Niveau dont le tracé est affiché, dernier niveau demandé par le curseur et
  // animation en cours.
  const shownLevel = useRef(initialLevel);
  const latestLevel = useRef(initialLevel);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Un morphing n'est jamais interrompu : repartir d'une forme à moitié
  // déformée fausse l'appariement des points entre tracés et donne une bouillie.
  // Les niveaux traversés pendant l'animation sont donc sautés : à la fin, on
  // enchaîne directement vers le dernier niveau demandé, depuis une forme entière.
  const playNext = useCallback(
    function playNext() {
      const icon = iconRef.current;
      if (!icon || timelineRef.current) return;
      if (shownLevel.current === latestLevel.current) return;

      const paths = icon.querySelectorAll<SVGPathElement>(".feeling-path");
      const target = LEVEL_PATHS[latestLevel.current - 1];
      shownLevel.current = latestLevel.current;

      if (reduceMotion) {
        paths.forEach((path) => path.setAttribute("d", target));
        return;
      }

      // Toujours un multiple de 360° au repos : le pictogramme finit de face.
      const startAngle = Number(gsap.getProperty(icon, "rotationY")) || 0;

      const timeline = gsap.timeline({
        onComplete: () => {
          timelineRef.current = null;
          playNext();
        },
      });
      timelineRef.current = timeline;
      timeline.to(paths, { morphSVG: target, duration: 0.7, ease: "power2.inOut" }, 0);
      timeline.to(
        icon,
        { rotationY: startAngle + 360, duration: 0.95, ease: "power2.inOut" },
        0,
      );
      timeline.to(icon, { scale: 1.12, z: 8, duration: 0.45, ease: "power2.out" }, 0);
      timeline.to(icon, { scale: 1, z: 0, duration: 0.5, ease: "power2.in" }, 0.45);
    },
    [reduceMotion],
  );

  useEffect(() => {
    latestLevel.current = level;
    playNext();
  }, [level, playNext]);

  useEffect(
    () => () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    },
    [],
  );

  return (
    <div
      className="relative shrink-0"
      style={{ ...iconSizeStyle(size), perspective: "420px" }}
      aria-hidden="true"
    >
      <div
        ref={iconRef}
        className="absolute inset-0 text-primary"
        style={{ transformStyle: "preserve-3d" }}
      >
        {LAYER_DEPTHS.map((depth) => (
          <svg
            key={depth}
            className="absolute inset-0 size-full fill-none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: `translateZ(${depth * -0.05}rem)`,
              // Les couches arrière s'assombrissent pour accentuer le relief.
              color: `color-mix(in srgb, var(--color-primary) ${100 - depth * 6}%, var(--color-neutral))`,
              filter:
                depth === 0
                  ? "drop-shadow(0 1px 1.5px color-mix(in srgb, var(--color-neutral) 28%, transparent))"
                  : undefined,
            }}
          >
            <path
              className="feeling-path"
              d={LEVEL_PATHS[initialLevel - 1]}
            />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default FeelingLevelMorph;
