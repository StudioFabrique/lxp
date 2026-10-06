import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../../utils/cn";

type Props = {
  message: ReactNode;
  id: string;
  anchorRef: RefObject<HTMLButtonElement | null>;
  bubbleRef?: RefObject<HTMLDivElement | null>;
  onOverlapChange?: (overlap: boolean) => void;
  selected: number | null;
  onQuestionSelect: (index: number, answer: ReactNode) => void;
};

export default function AuthChatbotQuestions({ message, id, anchorRef, bubbleRef, onOverlapChange, selected, onQuestionSelect }: Props) {
  const reducedMotion = useReducedMotion();
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const questions = [
    { label: "Que dois-je faire à cette étape ?", answer: message },
    { label: "Comment passer à la suite ?", answer: "Renseignez les informations demandées, puis utilisez le bouton en bas de l’étape pour continuer." },
    { label: "Puis-je revenir en arrière ?", answer: "Utilisez le bouton Précédent lorsqu’il est disponible pour revenir à l’étape précédente." },
  ];

  useEffect(() => {
    let frame = 0;
    let previousOverlap: boolean | null = null;
    const positionItems = (): void => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (rect) {
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const radius = 160;
        const towardsLeft = center.x + radius + 104 + 12 > window.innerWidth;
        const fan = [-45, 0, 45];
        const halfHeight = Math.max(...itemsRef.current.map(item => (item?.offsetHeight ?? 0) / 2));
        const extent = radius / Math.SQRT2 + halfHeight;
        const verticalShift = Math.max(12 - center.y + extent,
          Math.min(0, window.innerHeight - 12 - center.y - extent));
        const angles = towardsLeft ? fan.map(angle => 180 - angle) : fan;
        const bubble = bubbleRef?.current?.getBoundingClientRect();
        let overlap = false;
        itemsRef.current.forEach((item, index) => {
          if (!item) return;
          const angle = angles[index] * Math.PI / 180;
          const left = center.x + Math.cos(angle) * radius - item.offsetWidth / 2;
          const top = center.y + Math.sin(angle) * radius + verticalShift - item.offsetHeight / 2;
          const nextLeft = `${Math.max(12, Math.min(left, window.innerWidth - item.offsetWidth - 12))}px`;
          const nextTop = `${Math.max(12, Math.min(top, window.innerHeight - item.offsetHeight - 12))}px`;
          if (bubble) {
            const x = parseFloat(nextLeft);
            const y = parseFloat(nextTop);
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
  }, [anchorRef, bubbleRef, onOverlapChange]);

  return createPortal(
    <ul id={id} aria-label="Questions d’aide" className="pointer-events-none fixed inset-0 z-50">
      {questions.map((question, index) => (
        <motion.li key={question.label} ref={element => { itemsRef.current[index] = element; }}
          className="pointer-events-auto fixed w-52 max-w-[calc(100vw-1.5rem)]"
          initial={reducedMotion ? false : { opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9, transition: { duration: reducedMotion ? 0 : .12, delay: 0 } }}
          transition={{ duration: reducedMotion ? 0 : .3, delay: reducedMotion ? 0 : index * .12, ease: [.22, 1, .36, 1] }}>
          <button type="button" className={cn("btn h-auto min-h-11 w-full whitespace-normal rounded-full border px-4 py-3 text-sm font-normal shadow-md", selected === index ? "btn-accent border-accent-content/40" : "btn-secondary border-secondary-content/40")}
            aria-pressed={selected === index}
            onClick={() => {
              onQuestionSelect(index, question.answer);
            }}>
            {question.label}
          </button>
        </motion.li>
      ))}
    </ul>,
    document.body,
  );
}
