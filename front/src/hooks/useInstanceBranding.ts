import { useEffect, useState } from "react";

import { INSTANCE_LOGO, INSTANCE_LOGO_COLOR } from "../../config/urls";

type InstanceBranding = {
  /** Adresse du logo de l'organisme, `null` quand il n'en a pas. */
  logoUrl: string | null;
  /** Fond coloré associé au logo, tel que configuré pour l'instance. */
  backgroundColor?: string;
};

/** Logo de l'organisme et sa couleur de fond, comme dans la barre latérale. */
export const useInstanceBranding = (): InstanceBranding => {
  const [hasLogo, setHasLogo] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<string>();

  useEffect(() => {
    const image = new Image();
    image.onload = () => setHasLogo(true);
    image.onerror = () => setHasLogo(false);
    image.src = INSTANCE_LOGO;

    let isCurrent = true;
    fetch(INSTANCE_LOGO_COLOR)
      .then(async (response) => {
        if (response.ok && isCurrent) setBackgroundColor((await response.text()).trim());
      })
      .catch(() => undefined);
    return () => {
      isCurrent = false;
      image.onload = null;
      image.onerror = null;
    };
  }, []);

  return { logoUrl: hasLogo ? INSTANCE_LOGO : null, backgroundColor };
};
