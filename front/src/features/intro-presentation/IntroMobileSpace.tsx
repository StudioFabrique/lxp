import { useEffect, useMemo, useRef } from "react";
import { Bot, Check, EllipsisVertical, House, Menu } from "lucide-react";

import SidebarLogo from "../../components/sidebar/SidebarLogo";
import { sidebarItems } from "../../config/sidebarItems";
import { cn } from "../../utils/cn";
import IntroDialogueNav from "./IntroDialogueNav";
import type { IntroSpaceContent } from "./intro-space-content";
import { useIntroGuide } from "./useIntroGuide";

type Props = {
  content: IntroSpaceContent;
  onEnded: () => void;
};

type StepTarget = "bar" | "menu" | "nav" | "title" | "content" | "actions" | "assistant";

type Step = {
  id: string;
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
  const items = sidebarItems[layout];

  const steps = useMemo<Step[]>(
    () => [
      {
        id: "bar",
        target: "bar",
        text: "Voici votre barre de navigation : elle reste en haut de l'écran, sur toutes les pages.",
      },
      {
        id: "menu",
        target: "menu",
        text: "Ce bouton ouvre le menu : la liste de toutes vos sections.",
      },
      ...content.nav
        .filter((entry) => entry.description)
        .map<Step>((entry) => ({
          id: `nav-${entry.key}`,
          target: "nav",
          navKey: entry.key,
          text: `${entry.displayLabel} : ${entry.description}`,
        })),
      {
        id: "title",
        target: "title",
        text: "Le titre de la barre rappelle la page que vous consultez.",
      },
      {
        id: "content",
        target: "content",
        text: "Dessous s'affiche le contenu de la page : sur l'accueil, vos actions recommandées et vos derniers éléments.",
      },
      ...(content.headerAction
        ? [
            {
              id: "actions",
              target: "actions",
              text: `Ce bouton regroupe les actions de la page, par exemple « ${content.headerAction} ».`,
            } satisfies Step,
          ]
        : []),
      {
        id: "assistant",
        target: "assistant",
        text: "Je reste en bas à droite de l'écran : touchez-moi pour me poser une question.",
      },
    ],
    [content.nav, content.headerAction],
  );
  const guide = useIntroGuide(steps.length, content.space);
  const step = steps[guide.step];
  const isDrawerOpen = step.target === "menu" || step.target === "nav";
  const activeEntryRef = useRef<HTMLLIElement>(null);

  // Une longue liste de sections reste lisible : l'entrée expliquée est ramenée dans la vue du tiroir.
  useEffect(() => {
    activeEntryRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [step.id]);

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

      {/* Reproduit le tiroir du menu mobile ; l'explication reste lisible dessous. */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-10 bg-black/50" aria-hidden="true">
          <div className="absolute inset-y-0 left-0 w-[90%] max-w-md p-2 pb-[13rem]">
            <ul className="flex h-full flex-col gap-1 overflow-y-auto rounded-xl border border-(--sidebar-border) bg-(--sidebar-bg) p-3 text-(--sidebar-content)">
              {content.nav.map((entry) => {
                const Icon = items.find((item) => item.key === entry.key)?.icon;
                const active = step.navKey === entry.key;
                return (
                  <li
                    key={entry.key}
                    ref={active ? activeEntryRef : undefined}
                    className={cn(
                      "flex min-h-9 shrink-0 items-center gap-3 rounded-lg px-3 text-sm",
                      active && "bg-(--sidebar-active) font-medium text-(--sidebar-active-content) ring-1 ring-inset ring-(--sidebar-content)",
                    )}
                  >
                    {Icon && <Icon className="size-4 shrink-0" />}
                    {entry.displayLabel}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Même place et même aspect que l'assistant virtuel de l'application. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-6 right-6 z-20 flex size-12 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg",
          step.target === "assistant" && focusOnPage,
        )}
      >
        <Bot className="size-6" />
      </span>

      <section
        aria-label="Explication"
        className="absolute inset-x-3 bottom-[5.25rem] z-20 rounded-2xl border border-base-300 bg-base-100 p-4 text-primary shadow-lg"
      >
        <p aria-live="polite" className="text-sm leading-6">
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
    </div>
  );
};

export default IntroMobileSpace;
