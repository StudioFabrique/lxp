import { motion, useReducedMotion } from "motion/react";
import type { ReactNode, RefObject } from "react";

type Props = {
  message: ReactNode;
  waiting: boolean;
  hidden: boolean;
  delay: number;
  bubbleRef: RefObject<HTMLDivElement | null>;
};

export default function AuthChatbotBubble({ message, waiting, hidden, delay, bubbleRef }: Props) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div ref={bubbleRef} data-chatbot-bubble layout aria-hidden={hidden || undefined}
      className="relative col-start-1 row-start-1 min-w-0 self-center justify-self-end rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-left leading-6 text-primary"
      style={{ width: waiting ? 76 : "100%" }}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: hidden ? 0 : 1, y: 0 }}
      transition={{ opacity: { duration: reducedMotion ? 0 : .2, delay }, y: { duration: reducedMotion ? 0 : .4 }, layout: { duration: reducedMotion ? 0 : .4, ease: [.22, 1, .36, 1] } }}>

        {waiting ? <motion.div key="typing" role="status" aria-label="ANDRIA prépare sa réponse" className="flex h-6 items-center justify-center gap-1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .1 }}>
          {[0, 1, 2].map(index => <motion.span key={index} aria-hidden="true" className="size-1.5 rounded-full bg-primary"
            animate={reducedMotion ? undefined : { opacity: [.3, 1, .3], y: [0, -3, 0] }}
            transition={{ duration: .65, delay: index * .12, repeat: Infinity }} />)}
        </motion.div> : <motion.div key="answer" aria-live="polite" initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .25 }}>
          {message}
        </motion.div>}

      <span aria-hidden="true" className="absolute -right-[7px] top-1/2 size-3 -translate-y-1/2 rotate-45 border-r border-t border-base-300 bg-base-100" />
    </motion.div>
  );
}
