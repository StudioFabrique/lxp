import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../../utils/cn";
import { arrangeRadialSlots, radialAngles, radialRadius, spreadRadialSlots } from "./auth-chatbot-radial";

export type ChatbotRadialItem = {
  key: string;
  node: ReactNode;
  /** Placée à hauteur de l'assistant virtuel, du côté de sa bulle, quel que soit le nombre d'entrées. */
  pinned?: boolean;
  /** Hauteur dont l'entrée épinglée dépasse au-dessus de sa boîte (bouton d'angle) : les autres entrées la laissent libre. */
  overhang?: number;
};

type Props = {
  id: string;
  label?: string;
  items: ChatbotRadialItem[];
  anchorRef: RefObject<HTMLElement | null>;
  bubbleRef?: RefObject<HTMLDivElement | null>;
  /** Côté de la bulle : l'entrée épinglée s'y place, les autres entrées passent de l'autre côté quand il y a la place. */
  pinnedSide?: "left" | "right";
  onOverlapChange?: (overlap: boolean) => void;
  /** Petit écran : pas la place d'un éventail, les entrées s'empilent en bas de l'écran, la question libre en dernier. */
  stacked?: boolean;
  /** En pile : la question libre laisse de la place à gauche (barre du bas de la page, réduite en cercle). */
  pinnedInset?: boolean;
};

/**
 * Entrées disposées en éventail autour de l'assistant virtuel. L'éventail passe à
 * gauche près du bord droit de l'écran, se décale pour rester visible et signale
 * s'il recouvre la bulle de l'assistant, que l'appelant peut alors masquer.
 */
export default function AuthChatbotRadialMenu({ id, label = "Questions d’aide", items, anchorRef, bubbleRef, pinnedSide, onOverlapChange, stacked = false, pinnedInset = false }: Props) {
  const reducedMotion = useReducedMotion();
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const count = items.length;
  const pinnedIndex = items.findIndex(item => item.pinned);
  const pinnedOverhang = items[pinnedIndex]?.overhang ?? 0;

  useEffect(() => {
    // La pile recouvre le bas de l'écran, et avec lui la bulle de l'assistant virtuel : elle s'efface le temps du menu.
    if (stacked) {
      onOverlapChange?.(true);
      return;
    }
    let frame = 0;
    let previousOverlap: boolean | null = null;
    const compact = pinnedSide !== undefined;
    const radius = radialRadius(count, compact);
    const fan = radialAngles(count, pinnedIndex, compact);
    const positionItems = (): void => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (rect) {
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const roomRight = center.x + radius + 104 + 12 <= window.innerWidth;
        const roomLeft = center.x - radius - 104 - 12 >= 0;
        // Sans côté imposé, l'éventail va à droite et passe à gauche près du bord droit de l'écran.
        // Avec la bulle à gauche, les questions préfèrent la droite, et inversement ; faute de place, elles se replient du côté libre.
        const fanTowardsLeft = pinnedSide === undefined
          ? !roomRight
          : pinnedSide === "right" ? roomLeft || !roomRight : !roomRight && roomLeft;
        const halfHeight = Math.max(...itemsRef.current.map(item => (item?.offsetHeight ?? 0) / 2));
        const extent = radius * Math.sin(Math.max(...fan.map(Math.abs)) * Math.PI / 180) + halfHeight;
        // Avec une entrée épinglée, c'est elle qui reste à hauteur de l'assistant : les autres s'écartent, l'éventail ne se décale pas.
        const verticalShift = pinnedIndex >= 0 ? 0 : Math.max(12 - center.y + extent,
          Math.min(0, window.innerHeight - 12 - center.y - extent));
        const angles = fanTowardsLeft ? fan.map(angle => 180 - angle) : fan;
        const bubble = bubbleRef?.current?.getBoundingClientRect();
        const elements = itemsRef.current.map(item => item ?? null);
        const slots = elements.map((item, index) => {
          const height = item?.offsetHeight ?? 0;
          return { top: center.y + Math.sin(angles[index] * Math.PI / 180) * radius + verticalShift - height / 2, height };
        });
        const tops: number[] = [];
        // Entrée épinglée et éventail de part et d'autre de l'assistant : ils ne se gênent pas, l'éventail peut rester serré.
        const separateSides = pinnedIndex >= 0 && pinnedSide !== undefined && (pinnedSide === "left") !== fanTowardsLeft;
        if (pinnedIndex >= 0 && elements[pinnedIndex] && !separateSides) {
          arrangeRadialSlots(slots, pinnedIndex, 12, window.innerHeight - 12, 8, pinnedOverhang).forEach((top, index) => { tops[index] = top; });
        } else {
          // Les entrées se séparent de haut en bas, quel que soit leur ordre dans la liste.
          if (separateSides) tops[pinnedIndex] = Math.max(12, Math.min(slots[pinnedIndex].top, window.innerHeight - 12 - slots[pinnedIndex].height));
          const order = slots.map((_, index) => index).filter(index => index !== pinnedIndex || !separateSides).sort((a, b) => slots[a].top - slots[b].top);
          const spread = spreadRadialSlots(order.map(index => slots[index]), 12, window.innerHeight - 12);
          order.forEach((index, rank) => { tops[index] = spread[rank]; });
        }
        const avatarHalf = rect.width / 2;
        let overlap = false;
        elements.forEach((item, index) => {
          if (!item) return;
          // L'abscisse suit le cercle d'après la hauteur finale ; face à l'assistant virtuel, elle l'écarte de quoi ne pas le recouvrir.
          const offsetY = tops[index] + item.offsetHeight / 2 - center.y;
          const onCircle = Math.sqrt(Math.max(radius * radius - offsetY * offsetY, 0));
          const clear = Math.abs(offsetY) < avatarHalf + item.offsetHeight / 2 + 8 ? avatarHalf + item.offsetWidth / 2 + 12 : 0;
          const reach = Math.max(onCircle, clear);
          const towardsLeft = index === pinnedIndex && pinnedSide !== undefined ? pinnedSide === "left" : fanTowardsLeft;
          const left = center.x + (towardsLeft ? -reach : reach) - item.offsetWidth / 2;
          const nextLeft = `${Math.max(12, Math.min(left, window.innerWidth - item.offsetWidth - 12))}px`;
          const nextTop = `${tops[index]}px`;
          if (bubble) {
            const x = parseFloat(nextLeft);
            const y = tops[index];
            overlap ||= x < bubble.right + 12 && x + item.offsetWidth > bubble.left - 12
              && y < bubble.bottom + 12 && y + item.offsetHeight > bubble.top - 12;
          }
          if (item.style.left !== nextLeft) item.style.left = nextLeft;
          if (item.style.top !== nextTop) item.style.top = nextTop;
        });
        if (overlap !== previousOverlap) {
          previousOverlap = overlap;
          onOverlapChange?.(overlap);
        }
      }
      frame = window.requestAnimationFrame(positionItems);
    };
    positionItems();
    return () => window.cancelAnimationFrame(frame);
  }, [anchorRef, bubbleRef, count, pinnedIndex, pinnedOverhang, pinnedSide, onOverlapChange, stacked]);

  return createPortal(
    <ul id={id} aria-label={label} className={cn("pointer-events-none fixed z-50", stacked ? "inset-x-3 bottom-6 flex max-h-[calc(100dvh-3rem)] flex-col gap-2 overflow-y-auto overflow-x-hidden" : "inset-0")}>
      {items.map((item, index) => (
        <motion.li key={item.key} ref={element => { itemsRef.current[index] = element; }}
          className={cn(
            "pointer-events-auto",
            stacked ? cn("w-full shrink-0", item.pinned && "order-last mt-4", item.pinned && pinnedInset && "ml-auto w-[calc(100%-3.5rem)]") : cn("fixed max-w-[calc(100vw-1.5rem)]", item.pinned ? "w-72" : "w-52"),
          )}
          initial={reducedMotion ? false : { opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9, transition: { duration: reducedMotion ? 0 : .12, delay: 0 } }}
          transition={{ duration: reducedMotion ? 0 : .3, delay: reducedMotion ? 0 : index * .12, ease: [.22, 1, .36, 1] }}>
          {item.node}
        </motion.li>
      ))}
    </ul>,
    document.body,
  );
}
