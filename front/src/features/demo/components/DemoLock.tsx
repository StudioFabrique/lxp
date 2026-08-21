import { PropsWithChildren, type SyntheticEvent } from "react";
import { useDemoMode } from "../../../store/DemoContext";

type Props = {
  /** Message du tooltip. Adaptable pour une action au libellé particulier. */
  tip?: string;
  /** Rend l'enveloppe en bloc, pour ne pas casser une mise en page en colonne. */
  block?: boolean;
};

const DEFAULT_TIP = "Indisponible en mode démo";

/**
 * Rend une action visible mais inerte pendant la démonstration.
 *
 * Pas de `disabled` : un élément désactivé n'émet plus d'événement de survol,
 * et le tooltip qui explique pourquoi l'action ne répond pas ne s'afficherait
 * jamais. On intercepte donc en phase de capture, avant que l'événement
 * n'atteigne l'enfant, ce qui neutralise indifféremment un bouton, un lien de
 * navigation ou une entrée de menu sans toucher à son apparence.
 */
const DemoLock = ({ children, tip = DEFAULT_TIP, block }: PropsWithChildren<Props>) => {
  const { demoMode } = useDemoMode();

  if (!demoMode) return <>{children}</>;

  const block_ = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <span
      className={`tooltip tooltip-bottom ${block ? "block" : "inline-flex"}`}
      data-tip={tip}
      onClickCapture={block_}
      onSubmitCapture={block_}
      onKeyDownCapture={(event) => {
        if (event.key === "Enter" || event.key === " ") block_(event);
      }}
    >
      {children}
    </span>
  );
};

export default DemoLock;
