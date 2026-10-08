import type { IntroRoleOption } from "./intro-role";
import IntroSpaceVideo from "./IntroSpaceVideo";
import { useIntroStudentContent } from "./useIntroStudentContent";

type Props = {
  role: IntroRoleOption;
  /** Vrai quand la séquence doit démarrer ; le contenu se charge avant. */
  isPlaying: boolean;
  onEnded: () => void;
};

/** Charge le dashboard de l’apprenant pendant la détection, puis lance la séquence. */
const IntroStudentSpace = ({ role, isPlaying, onEnded }: Props) => {
  const { content, isReady } = useIntroStudentContent(role);

  return isPlaying && isReady ? (
    <IntroSpaceVideo content={content} onEnded={onEnded} />
  ) : null;
};

export default IntroStudentSpace;
