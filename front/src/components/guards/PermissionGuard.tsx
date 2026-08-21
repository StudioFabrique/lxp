import { PropsWithChildren, ReactNode, useContext } from "react";
import { AbilityContext } from "../../rbac/AbilityProvider";
import { AppAction, AppSubject } from "../../rbac/ability";
import { useDemoMode } from "../../store/DemoContext";
import DemoLock from "../../features/demo/components/DemoLock";

type Props = {
  action: AppAction | string;
  object: AppSubject | string;
  fallback?: ReactNode;
};

/** Actions qui modifient l'état, et qu'une démonstration doit rendre inertes. */
const WRITE_ACTIONS = new Set(["write", "update", "delete"]);

const PermissionGuard = ({
  children,
  action,
  object,
  fallback = null,
}: PropsWithChildren<Props>) => {
  const ability = useContext(AbilityContext);
  const { demoMode } = useDemoMode();

  if (!ability.can(action as AppAction, object as AppSubject)) return fallback;

  // Ce garde enveloppe l'essentiel des boutons d'ajout, de modification et de
  // suppression de l'application, y compris des liens de création. En mode
  // démonstration on les laisse donc visibles, mais sans effet : les masquer
  // donnerait d'ANDRIA l'image d'une interface amputée.
  if (demoMode && WRITE_ACTIONS.has(action as string)) {
    return <DemoLock>{children}</DemoLock>;
  }

  return <>{children}</>;
};

export default PermissionGuard;
