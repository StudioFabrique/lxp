import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "../../utils/cn";
import type { IntroCard } from "./intro-content";
import { OVERVIEW_DIALOGUE } from "./intro-dialogue";
import { INTRO_LEVELS, INTRO_PYRAMID_LEVELS } from "./intro-levels";
import { introActivityKind, type IntroActivityKind } from "./intro-activity-samples";
import type { IntroFormationOption } from "./intro-example-formations";
import IntroActivityPreviewModal from "./IntroActivityPreviewModal";
import IntroFormationSelector from "./IntroFormationSelector";
import IntroLevelDetail from "./IntroLevelDetail";
import IntroMobilePyramid from "./IntroMobilePyramid";
import IntroSceneHeading from "./IntroSceneHeading";
import { useIntroPresentation } from "./useIntroPresentation";

type Props = {
  /** Une carte par niveau : l'élément retenu, ce qu'il contient et ses composants. */
  cards: IntroCard[];
  onSelectChild?: (parentIndex: number, rowIndex: number) => void;
  formationOptions?: readonly IntroFormationOption[];
  selectedFormationId?: string;
  onSelectFormation?: (id: string) => void;
  isSaving: boolean;
  /** Appelé quand l'utilisateur poursuit la découverte après le dernier niveau. */
  onComplete: () => void;
};

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Présentation des niveaux sur mobile. La scène de bureau repose sur le défilement, des mesures de
 * mise en page et l'assistant virtuel placé à côté des plaques : rien de cela ne tient dans un écran
 * étroit. Ici, la pyramide 3D reste en haut et on avance niveau par niveau avec des boutons ; le texte
 * que l'assistant dit sur le bureau est affiché dans la page.
 * Palier 0 : introduction ; paliers 1 à N : un niveau chacun, comme sur le bureau.
 */
const IntroMobileScene = ({
  cards,
  onSelectChild,
  formationOptions,
  selectedFormationId,
  onSelectFormation,
  isSaving,
  onComplete,
}: Props) => {
  const maxStep = Math.max(1, cards.length - 1);
  const { sidebarPhase } = useIntroPresentation();
  const isCompactSidebar = sidebarPhase !== "normal";
  const [step, setStep] = useState(0);
  const [activityPreview, setActivityPreview] = useState<{ kind: IntroActivityKind; title: string } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const goToStep = (next: number) => setStep(Math.min(Math.max(next, 0), maxStep));
  const level = step >= 1 ? INTRO_PYRAMID_LEVELS[step - 1] : undefined;
  const card = step >= 1 ? cards[step] : undefined;
  const isLast = step >= maxStep;

  // Chaque palier repart du haut de son contenu.
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [step]);

  const selectRow = (row: number) => {
    if (!card) return;
    if (step < INTRO_LEVELS.length - 1) {
      onSelectChild?.(step, row);
      goToStep(step + 1);
      return;
    }
    const title = card.rows[row]?.title;
    const kind = title ? introActivityKind(title) : undefined;
    if (title && kind) setActivityPreview({ kind, title });
  };

  return (
    <div className={cn("absolute inset-0 flex flex-col", isCompactSidebar ? "pt-16" : "pt-2")}>
      <div ref={contentRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 pb-4">
        <IntroSceneHeading className="text-center text-xl" />
        <IntroMobilePyramid activeIndex={step - 1} visibleLevelCount={maxStep} onSelect={(index) => goToStep(index + 1)} />

        <p className="sr-only" aria-live="polite">
          {level ? `${level.label} : ${level.explanation}` : OVERVIEW_DIALOGUE[0]}
        </p>

        {step === 0 || !level || !card ? (
          <section className="rounded-2xl border border-base-300 bg-base-200 p-4" aria-label="Introduction">
            <p className="text-sm text-base-content/70">{INTRO_LEVELS[0].label}</p>
            <h2 className="text-xl font-bold leading-tight">{cards[0]?.title}</h2>
            <p className="mt-2 text-sm">{OVERVIEW_DIALOGUE[0]}</p>
          </section>
        ) : (
          <>
            <section className="rounded-2xl border border-base-300 bg-base-200 p-4" aria-label={level.label}>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <level.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                {level.label}
              </h2>
              <p className="mt-1 text-sm">{level.explanation}</p>
            </section>
            {formationOptions && selectedFormationId && onSelectFormation ? (
              <IntroFormationSelector
                options={formationOptions}
                selectedId={selectedFormationId}
                onSelect={(id) => {
                  onSelectFormation(id);
                  goToStep(1);
                }}
              />
            ) : null}
            <IntroLevelDetail card={card} index={step} activeDetail={-1} onSelectRow={selectRow} />
          </>
        )}
      </div>

      {/* Le bouton « Passer la présentation » de la page occupe le bas à gauche : la navigation passe au-dessus. */}
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-14 pt-2">
        <button type="button" className="btn btn-outline btn-sm" disabled={step === 0} onClick={() => goToStep(step - 1)}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Précédent
        </button>
        <p className="text-sm tabular-nums" aria-label={`Palier ${step} sur ${maxStep}`}>
          <span className="text-xl font-bold text-primary">{pad(step)}</span>
          <span className="text-base-content/60"> / {pad(maxStep)}</span>
        </p>
        {isLast ? (
          <button type="button" className="btn btn-primary btn-sm" disabled={isSaving} onClick={onComplete}>
            Continuer
            {isSaving ? (
              <span className="loading loading-spinner loading-xs" aria-hidden="true" />
            ) : (
              <ArrowRight className="size-4" aria-hidden="true" />
            )}
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => goToStep(step + 1)}>
            Suivant
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <IntroActivityPreviewModal
        kind={activityPreview?.kind ?? null}
        title={activityPreview?.title ?? ""}
        onClose={() => setActivityPreview(null)}
      />
    </div>
  );
};

export default IntroMobileScene;
