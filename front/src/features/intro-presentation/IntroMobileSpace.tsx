import { useCallback, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Bot, Check, EllipsisVertical, House, Menu } from "lucide-react";

import SidebarLogo from "../../components/sidebar/SidebarLogo";
import SidebarOrganisationLogo from "../../components/sidebar/SidebarOrganisationLogo";
import { useInstanceBranding } from "../../hooks/useInstanceBranding";
import { useVisualPreferences } from "../../store/VisualPreferences";
import { cn } from "../../utils/cn";
import IntroDialogueNav from "./IntroDialogueNav";
import IntroMobileDrawer from "./IntroMobileDrawer";
import IntroMobileOpening from "./IntroMobileOpening";
import type { IntroSpaceContent } from "./intro-space-content";
import { useIntroGuide } from "./useIntroGuide";

type Props = {
  content: IntroSpaceContent;
  onEnded: () => void;
};

type StepTarget = "bar" | "menu" | "nav" | "title" | "content" | "actions" | "assistant";

type Step = {
  id: string;
  /** Intitulé de la carte d'explication, au-dessus du texte. */
  title: string;
  target: StepTarget;
  /** Entrée du menu mise en avant, pour les étapes `nav`. */
  navKey?: string;
  text: string;
};

/** Contour de l'élément expliqué : clair sur la barre sombre, de la couleur primaire ailleurs. */
const focusOnBar = "ring-2 ring-(--sidebar-content) ring-offset-2 ring-offset-(--sidebar-bg)";
const focusOnPage = "ring-2 ring-primary ring-offset-2 ring-offset-base-100";

/**
 * Tutoriel de l'espace sur mobile, qui reprend celui de la séquence de bureau avec la mise en page
 * mobile : la barre du haut, le tiroir du menu (une explication par section), le contenu de la page,
 * les actions et l'assistant virtuel. Il se lit avec « Précédent » et « Suivant » ; rien ne défile seul.
 */
const IntroMobileSpace = ({ content, onEnded }: Props) => {
  const layout = content.space === "student" ? "student" : "admin";
  const { logoUrl, backgroundColor } = useInstanceBranding();

  const steps = useMemo<Step[]>(
    () => [
      {
        id: "bar",
        title: "Barre de navigation",
        target: "bar",
        text: "Voici votre barre de navigation : elle reste en haut de l'écran, sur toutes les pages.",
      },
      {
        id: "menu",
        title: "Menu",
        target: "menu",
        text: "Ce bouton ouvre le menu : la liste de toutes vos sections.",
      },
      ...content.nav
        .filter((entry) => entry.description)
        .map<Step>((entry) => ({
          id: `nav-${entry.key}`,
          title: entry.displayLabel,
          target: "nav",
          navKey: entry.key,
          text: entry.description,
        })),
      {
        id: "title",
        title: "Titre de la page",
        target: "title",
        text: "Le titre de la barre rappelle la page que vous consultez.",
      },
      {
        id: "content",
        title: "Contenu de la page",
        target: "content",
        text: "Dessous s'affiche le contenu de la page : sur l'accueil, votre mise en route et vos derniers éléments.",
      },
      ...(content.headerAction
        ? [
            {
              id: "actions",
              title: "Actions de la page",
              target: "actions",
              text: `Ce bouton regroupe les actions de la page, par exemple « ${content.headerAction} ».`,
            } satisfies Step,
          ]
        : []),
      {
        id: "assistant",
        title: "Assistant virtuel",
        target: "assistant",
        text: "Je reste en bas à droite de l'écran : touchez-moi pour me poser une question.",
      },
    ],
    [content.nav, content.headerAction],
  );
  const guide = useIntroGuide(steps.length, content.space);
  const step = steps[guide.step];
  const isDrawerOpen = step.target === "menu" || step.target === "nav";
  const branding = { logoUrl, backgroundColor };
  // Même condition que le reste de l'application : sans animations, l'ouverture 3D est omise.
  const reduceMotion = useReducedMotion();
  const { animations } = useVisualPreferences();
  const instant = reduceMotion || !animations;
  const [isOpening, setIsOpening] = useState(!instant);
  const endOpening = useCallback(() => setIsOpening(false), []);

  return (
    <div className="absolute inset-0 bg-base-100 p-2">
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border border-(--sidebar-border) bg-(--sidebar-bg) p-2 text-(--sidebar-content) shadow-sm",
          step.target === "bar" && focusOnPage,
        )}
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            step.target === "menu" && focusOnBar,
          )}
        >
          <Menu className="size-4" aria-hidden="true" />
        </span>
        {logoUrl && (
          <SidebarOrganisationLogo
            logoUrl={logoUrl}
            backgroundColor={backgroundColor}
            websiteUrl={null}
            variant="bar"
          />
        )}
        <p
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 text-sm font-medium",
            step.target === "title" && focusOnBar,
          )}
        >
          <House className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{content.title}</span>
        </p>
        <div className="w-16 shrink-0 pr-1">
          <SidebarLogo />
        </div>
        {content.headerAction && (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              step.target === "actions" && focusOnBar,
            )}
          >
            <EllipsisVertical className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>

      <div
        className={cn(
          "mx-2 mt-6 flex flex-col gap-3 rounded-2xl",
          step.target === "content" && cn(focusOnPage, "p-2"),
        )}
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
      </div>

      {/* Reproduit le menu mobile ; l'explication reste lisible dessous. */}
      {isDrawerOpen && (
        <IntroMobileDrawer
          content={content}
          layout={layout}
          explainedKey={step.navKey}
          branding={branding}
        />
      )}

      {/* Même place et même aspect que l'assistant virtuel de l'application ; il arrive après l'ouverture et rebondit quand il est expliqué. */}
      <motion.span
        aria-hidden="true"
        className={cn(
          "absolute bottom-6 right-6 z-20 flex size-12 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg",
          step.target === "assistant" && focusOnPage,
        )}
        initial={{ scale: instant ? 1 : 0 }}
        animate={{ scale: 1, y: !instant && step.target === "assistant" ? [0, -8, 0] : 0 }}
        transition={{
          scale: { delay: instant ? 0 : 1.4, type: "spring", stiffness: 260, damping: 18 },
          y: { duration: 1.2, repeat: step.target === "assistant" ? Infinity : 0 },
        }}
      >
        <Bot className="size-6" />
      </motion.span>

      <section
        aria-label="Explication"
        className="absolute inset-x-3 bottom-[5.25rem] z-20 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-lg"
      >
        <span className="block text-xs text-base-content/60">
          Étape {guide.step + 1} sur {steps.length}
        </span>
        <h2 className="text-lg font-bold leading-tight text-base-content">{step.title}</h2>
        <p aria-live="polite" className="mt-1 text-sm leading-6 text-base-content">
          {step.text}
        </p>
        <IntroDialogueNav
          previous={guide.previous}
          next={guide.next}
          additionalAction={{
            label: "Terminer",
            icon: <Check className="size-3.5" aria-hidden="true" />,
            onClick: onEnded,
          }}
        />
      </section>
      {isOpening && (
        <IntroMobileOpening content={content} layout={layout} branding={branding} onDone={endOpening} />
      )}
    </div>
  );
};

export default IntroMobileSpace;
