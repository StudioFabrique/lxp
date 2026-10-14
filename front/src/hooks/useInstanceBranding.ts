import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { INSTANCE_LOGO, INSTANCE_LOGO_COLOR } from "../config/urls";
import { profileApi } from "../features/profile/api/profile.api";
import { profileKeys } from "../features/profile/api/profile.keys";

type InstanceBranding = {
  /** Adresse du logo de l'organisme, `null` quand il n'en a pas. */
  logoUrl: string | null;
  /** Fond coloré associé au logo, tel que configuré pour l'instance. */
  backgroundColor?: string;
};

/**
 * Logo de l'organisme et sa couleur de fond. L'existence du logo vient des
 * paramètres de l'instance : le fichier n'est demandé que s'il existe, pour ne
 * pas provoquer de 404 quand aucun logo n'est défini.
 */
export const useInstanceBranding = (): InstanceBranding => {
  const { data: settings } = useQuery({
    queryKey: profileKeys.instanceSettings(),
    queryFn: profileApi.queries.getInstanceSettings,
    staleTime: 5 * 60 * 1000,
  });
  const hasLogo = settings?.hasLogo === true;
  const [backgroundColor, setBackgroundColor] = useState<string>();

  useEffect(() => {
    if (!hasLogo) return;
    const controller = new AbortController();
    fetch(INSTANCE_LOGO_COLOR, { signal: controller.signal })
      .then(async (response) => {
        if (response.ok) setBackgroundColor((await response.text()).trim());
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [hasLogo]);

  return {
    logoUrl: hasLogo ? INSTANCE_LOGO : null,
    backgroundColor: hasLogo ? backgroundColor : undefined,
  };
};
