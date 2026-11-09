import { useEffect } from "react";
import { motion } from "motion/react";

import type { SidebarLayout } from "../../config/sidebarItems";
import IntroMobileDrawer from "./IntroMobileDrawer";
import type { IntroSpaceContent } from "./intro-space-content";

type Props = {
  content: IntroSpaceContent;
  layout: SidebarLayout;
  branding: { logoUrl: string | null; backgroundColor?: string };
  /** Appelé quand la scène a fini de se redresser : elle laisse alors place à la vraie page. */
  onDone: () => void;
};

const DURATION_S = 1.8;
// Filet de sécurité : la scène ne doit jamais rester par-dessus le tutoriel si l'animation ne se termine pas.
const FALLBACK_MS = (DURATION_S + 1) * 1000;

/**
 * Ouverture du tutoriel mobile, sur le modèle du film du bureau : le menu apparaît incliné en 3D, se
 * redresse, puis la scène s'efface sur la vraie page. Décorative (masquée aux lecteurs d'écran) et
 * transparente aux touches : « Suivant » reste utilisable pendant qu'elle joue.
 */
const IntroMobileOpening = ({ content, layout, branding, onDone }: Props) => {
  useEffect(() => {
    const timer = setTimeout(onDone, FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      data-intro-opening
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-15 overflow-hidden bg-base-100 [perspective:900px]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: DURATION_S, times: [0, 0.7, 1], ease: "easeOut" }}
      onAnimationComplete={onDone}
    >
      <motion.div
        className="absolute inset-0 origin-left"
        initial={{ rotateY: -50, rotateX: 18, rotateZ: -4, scale: 0.82, x: -24, y: 32 }}
        animate={{ rotateY: 0, rotateX: 0, rotateZ: 0, scale: 1, x: 0, y: 0 }}
        transition={{ duration: DURATION_S * 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <IntroMobileDrawer content={content} layout={layout} branding={branding} scrim={false} />
      </motion.div>
    </motion.div>
  );
};

export default IntroMobileOpening;
