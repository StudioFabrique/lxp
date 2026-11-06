import { useEffect, useRef } from "react";
import { Bot, EllipsisVertical, House, Menu } from "lucide-react";
import { motion } from "motion/react";

import SidebarLogo from "../../components/sidebar/SidebarLogo";
import { prefersReducedMotion } from "./intro-motion";
import type { IntroSpaceContent } from "./intro-space-content";

type Props = {
  content: IntroSpaceContent;
  onEnded: () => void;
};

/** Durée de la construction (l'assistant virtuel apparaît en dernier), puis temps de lecture avant de rendre la main. */
const SEQUENCE_MS = 2400 + 1600;

/**
 * Sur mobile, la barre latérale est une barre en haut de l'écran et un tiroir : la séquence de bureau
 * (scène 3D en paysage) n'y est pas lisible. Cette version construit la vraie interface mobile, dans
 * l'ordre où l'utilisateur la découvrira : barre du haut, contenu du dashboard, puis assistant virtuel.
 */
const IntroMobileSpace = ({ content, onEnded }: Props) => {
  const reduced = prefersReducedMotion();
  const onEndedRef = useRef(onEnded);
  const delayed = (seconds: number) => (reduced ? 0 : seconds);
  const fade = (seconds: number) => ({
    initial: reduced ? false : { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: reduced ? 0 : 0.35, delay: delayed(seconds) },
  } as const);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // Avec les animations réduites, la scène s'affiche terminée : l'utilisateur continue lui-même.
  useEffect(() => {
    if (reduced) return;
    const timer = setTimeout(() => {
      if (!document.hidden) onEndedRef.current();
    }, SEQUENCE_MS);
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <div className="absolute inset-0 bg-base-100 p-2">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.5, delay: delayed(0.1), ease: "easeOut" }}
        className="flex w-full items-center gap-2 rounded-xl border border-(--sidebar-border) bg-(--sidebar-bg) p-2 text-(--sidebar-content) shadow-sm"
      >
        <motion.span className="flex size-8 shrink-0 items-center justify-center" {...fade(0.5)}>
          <Menu className="size-4" aria-hidden="true" />
        </motion.span>
        <motion.p
          className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium"
          {...fade(0.7)}
        >
          <House className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{content.title}</span>
        </motion.p>
        <motion.div className="w-16 shrink-0 pr-1" {...fade(0.9)}>
          <SidebarLogo />
        </motion.div>
        {content.headerAction && (
          <motion.span className="flex size-8 shrink-0 items-center justify-center" {...fade(1.1)}>
            <EllipsisVertical className="size-4" aria-hidden="true" />
          </motion.span>
        )}
      </motion.div>

      <motion.div
        className="mx-2 mt-6 flex flex-col gap-3"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.5, delay: delayed(1.3) }}
      >
        {content.headerAction && (
          <div className="flex justify-center rounded-2xl border border-dashed border-primary/40 bg-base-200 px-4 py-8">
            <span className="btn btn-primary pointer-events-none shadow-lg shadow-primary/30">
              {content.headerAction}
            </span>
          </div>
        )}
        {content.cards.slice(0, 2).map((card) => (
          <section key={card.id} className="rounded-2xl border border-base-300 bg-base-200 p-4">
            <h2 className="text-sm font-bold">{card.title}</h2>
            {card.rows.map((row) => (
              <p key={row.title} className="mt-2 text-sm">
                <span className="block truncate font-medium">{row.title}</span>
                <span className="block truncate text-xs text-base-content/70">{row.subtitle}</span>
              </p>
            ))}
          </section>
        ))}
      </motion.div>

      {/* Même place et même aspect que l'assistant virtuel de l'application. */}
      <motion.span
        aria-hidden="true"
        className="absolute bottom-6 right-6 flex size-12 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg"
        initial={reduced ? false : { opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: delayed(2) }}
      >
        <Bot className="size-6" />
      </motion.span>

      {reduced && (
        <button
          type="button"
          className="btn btn-primary btn-sm absolute bottom-4 left-1/2 -translate-x-1/2"
          onClick={onEnded}
        >
          Continuer
        </button>
      )}
    </div>
  );
};

export default IntroMobileSpace;
