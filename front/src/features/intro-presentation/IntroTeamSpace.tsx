import type { IntroRoleOption } from "./intro-role";
import IntroSpaceVideo from "./IntroSpaceVideo";
import { useIntroTeamContent } from "./useIntroTeamContent";

type Props = {
  role: IntroRoleOption;
  /** Vrai quand la séquence doit démarrer ; le contenu se charge avant. */
  isPlaying: boolean;
  onEnded: () => void;
};

/** Charge le dashboard de l'équipe pendant la détection, puis lance la séquence. */
const IntroTeamSpace = ({ role, isPlaying, onEnded }: Props) => {
  const { content, isReady } = useIntroTeamContent(role);

  return isPlaying && isReady ? (
    <IntroSpaceVideo content={content} onEnded={onEnded} />
  ) : null;
};

export default IntroTeamSpace;
