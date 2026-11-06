import type { IntroRoleOption } from "./intro-role";
import IntroMobileSpace from "./IntroMobileSpace";
import IntroSpaceVideo from "./IntroSpaceVideo";
import { useIsMobile } from "../../hooks/useMediaQuery";
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

  // Sur mobile, la séquence de bureau (scène 3D en paysage) est remplacée par la barre mobile.
  const isMobile = useIsMobile();
  const Space = isMobile ? IntroMobileSpace : IntroSpaceVideo;

  return isPlaying && isReady ? (
    <Space content={content} onEnded={onEnded} />
  ) : null;
};

export default IntroTeamSpace;
