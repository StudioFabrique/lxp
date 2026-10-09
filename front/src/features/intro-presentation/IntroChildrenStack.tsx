import { useLayoutEffect, useRef, useState } from "react";

import { INTRO_ROW_COUNT, type IntroCard } from "./intro-content";
import { INTRO_LEVELS } from "./intro-levels";
import { gsap, prefersReducedMotion } from "./intro-motion";
import { STACK_DEPTH, childBox, layerBox } from "./intro-stack-layout";
import IntroStackPlate from "./IntroStackPlate";

type Props = {
  /** Carte du niveau expliqué ; absente tant que la pyramide complète est affichée. */
  card?: IntroCard;
  /** Rang du niveau de la carte dans `INTRO_LEVELS`, 0 pour l'introduction. */
  levelIndex: number;
  /** Élément survolé, à gauche comme dans la liste de droite : -1 si aucun. */
  highlightedRow: number;
  onHighlightRow: (row: number) => void;
};

type Shown = { levelIndex: number; card: IntroCard };

const toBoxProps = (box: ReturnType<typeof layerBox>) => ({
  left: box.x - box.width / 2,
  top: box.y - box.height / 2,
  width: box.width,
  height: box.height,
  z: box.z,
});

/**
 * Pyramide qui se construit niveau par niveau. Une couche par niveau retenu
 * (formation, parcours, module...), et sur la dernière couche les éléments du
 * même niveau côte à côte, une carte par ligne de la liste de droite. Au niveau
 * suivant, la première carte grandit jusqu'à devenir la couche suivante, puis
 * ses propres éléments se posent dessus. Elle est posée dans le repère
 * 3D de la pyramide (`.intro-tilt`) : elle en partage la caméra et le rangement
 * sur le côté.
 */
const IntroChildrenStack = ({
  card,
  levelIndex,
  highlightedRow,
  onHighlightRow,
}: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const target: Shown | null =
    card && levelIndex >= 1 ? { levelIndex, card } : null;
  // Niveau dont les cartes sont posées : il suit `target` après l'animation de sortie.
  const [shown, setShown] = useState<Shown | null>(null);
  const targetRef = useRef(target);
  const shownRef = useRef<Shown | null>(null);
  // Nature de la dernière bascule : au retour, la couche rétrécie devient la première
  // carte ; lors d'un saut de plusieurs niveaux, toutes les couches se reposent.
  const transitionRef = useRef<"forward" | "back" | "jump">("jump");
  useLayoutEffect(() => {
    targetRef.current = target;
  });

  const targetLevel = target?.levelIndex ?? 0;
  const shownLevel = shown?.levelIndex ?? 0;

  // Sortie des cartes du niveau précédent, puis bascule vers celles du nouveau niveau.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const next = targetRef.current;
    const current = shownRef.current;
    if (!root || current?.levelIndex === next?.levelIndex) return;

    const commit = () => {
      const gap = current && next ? next.levelIndex - current.levelIndex : 0;
      transitionRef.current =
        gap === 1 ? "forward" : gap === -1 ? "back" : "jump";
      shownRef.current = next;
      setShown(next);
    };
    const children = gsap.utils.toArray<HTMLElement>(
      ".intro-child-plate",
      root,
    );
    const layers = gsap.utils.toArray<HTMLElement>(".intro-layer-plate", root);
    if (!current || !children.length || prefersReducedMotion()) {
      commit();
      return;
    }

    // Une sortie interrompue se défait : les plaques retrouvent leur place et leur opacité.
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete: commit });
      if (next && next.levelIndex === current.levelIndex + 1) {
        // La première carte grandit jusqu'à la taille de la couche suivante.
        timeline.to(
          children.slice(1),
          { opacity: 0, duration: 0.3, ease: "power1.out" },
          0,
        );
        timeline.to(
          children[0],
          {
            ...toBoxProps(layerBox(next.levelIndex)),
            duration: 0.8,
            ease: "power2.inOut",
          },
          0,
        );
      } else if (next && next.levelIndex === current.levelIndex - 1) {
        // Retour : la couche rétrécit à sa place parmi les éléments du niveau précédent.
        timeline.to(
          children,
          { opacity: 0, duration: 0.3, ease: "power1.out" },
          0,
        );
        timeline.to(
          layers[layers.length - 1],
          {
            ...toBoxProps(childBox(next.levelIndex, 0, INTRO_ROW_COUNT)),
            duration: 0.8,
            ease: "power2.inOut",
          },
          0,
        );
      } else {
        timeline.to(
          [...layers, ...children],
          { opacity: 0, duration: 0.3, ease: "power1.out" },
          0,
        );
      }
    }, root);
    return () => context.revert();
  }, [targetLevel]);

  // Entrée des cartes du nouveau niveau : elles se déploient côte à côte depuis la
  // couche qui les porte, en montant l'une après l'autre.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !shownLevel) return;
    const plates = gsap.utils.toArray<HTMLElement>(
      ".intro-layer-plate, .intro-child-plate",
      root,
    );
    plates.forEach((plate) =>
      gsap.set(plate, { z: Number(plate.dataset.depth) }),
    );
    // Les couches qui restent d'un niveau à l'autre ont pu être effacées par la sortie.
    const layers = gsap.utils.toArray<HTMLElement>(".intro-layer-plate", root);
    gsap.set(layers, { clearProps: "opacity" });
    if (prefersReducedMotion()) return;
    const isJump = transitionRef.current === "jump";
    const all = gsap.utils.toArray<HTMLElement>(".intro-child-plate", root);
    // Au retour, la première carte est déjà là (la couche rétrécie) : les autres en sortent.
    const isBack = transitionRef.current === "back";
    const children = isBack ? all.slice(1) : all;
    const originX = isBack ? Number(all[0]?.dataset.x) : 0;
    const context = gsap.context(() => {
      if (isJump) {
        gsap.from(layers, {
          opacity: 0,
          z: (_index: number, plate: HTMLElement) =>
            Number(plate.dataset.depth) - STACK_DEPTH * 2,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
        });
      }
      gsap.from(children, {
        delay: isJump ? 0.2 + layers.length * 0.1 : 0,
        opacity: 0,
        scale: 0.55,
        x: (_index: number, plate: HTMLElement) =>
          isBack
            ? originX - Number(plate.dataset.x)
            : -Number(plate.dataset.x) * 0.85,
        z: (_index: number, plate: HTMLElement) =>
          Number(plate.dataset.depth) - (isBack ? 0 : STACK_DEPTH),
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
      });
    }, root);
    return () => context.revert();
  }, [shownLevel]);

  const isCurrent = target !== null && shown?.levelIndex === target.levelIndex;
  // Tant que la sortie se joue, `shown` garde les cartes précédentes ; une fois
  // posées, elles reprennent les données à jour de la carte.
  const displayed = isCurrent ? target : shown;
  const childLevel = displayed
    ? INTRO_LEVELS[Math.min(displayed.levelIndex + 1, INTRO_LEVELS.length - 1)]
    : undefined;

  return (
    <div
      ref={rootRef}
      className="intro-children-stack absolute left-0 top-0 size-0 [transform-style:preserve-3d]"
    >
      {displayed && childLevel ? (
        <>
          {/* La couche de la formation est la plaque de la pyramide, qui reste en place. */}
          {Array.from({ length: displayed.levelIndex - 1 }, (_, index) => {
            const level = INTRO_LEVELS[index + 2];
            return (
              <IntroStackPlate
                key={level.id}
                variant="layer"
                label={level.label}
                icon={level.icon}
                box={layerBox(index + 2)}
              />
            );
          })}
          {displayed.card.rows.map((row, index) => (
            <IntroStackPlate
              key={`${displayed.levelIndex}-${index}`}
              variant="child"
              label={row.title}
              icon={childLevel.icon}
              box={childBox(
                displayed.levelIndex,
                index,
                displayed.card.rows.length,
              )}
              isActive={isCurrent && index === highlightedRow}
              onHoverChange={(isHovered) =>
                onHighlightRow(isHovered ? index : -1)
              }
            />
          ))}
        </>
      ) : null}
    </div>
  );
};

export default IntroChildrenStack;
