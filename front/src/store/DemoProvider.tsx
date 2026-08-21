import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../config/urls";
import { setDemoMode } from "../lib/axios";
import {
  DEFAULT_DEMO_CONFIG,
  DemoContext,
  type DemoConfig,
} from "./DemoContext";

/**
 * Ce que le front ne peut pas savoir à la construction.
 *
 * Le bundle est bâti une seule fois, dans l'image Docker que partagent toutes
 * les instances : `front/.env.production` est versionné et copié par le
 * Dockerfile, donc une variable `VITE_*` vaut la même chose en production et
 * sur l'instance de démonstration. Ce qui distingue les deux doit venir du
 * serveur au moment de l'exécution.
 *
 * L'appel est fait avec un axios nu : l'instance partagée réagit aux 401 en
 * tentant un rafraîchissement de session puis une déconnexion, ce qui n'a pas
 * de sens pour une configuration publique lue avant toute session.
 */
export function DemoProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<DemoConfig>(DEFAULT_DEMO_CONFIG);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    axios
      .get<DemoConfig>(`${BASE_API_URL}/demo/config`)
      .then((response) => {
        if (!cancelled) setConfig({ ...DEFAULT_DEMO_CONFIG, ...response.data });
      })
      .catch(() => {
        // Une instance plus ancienne n'expose pas la route : on reste sur le
        // comportement normal, qui est l'absence de mode démonstration.
      })
      .finally(() => {
        if (!cancelled) setIsConfigLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Le client HTTP partagé doit connaître le mode pour arrêter les écritures
  // avant l'envoi ; il n'a pas de contexte React à interroger.
  useEffect(() => {
    setDemoMode(config.demoMode);
  }, [config.demoMode]);

  // Filet pour les formulaires soumis au clavier ou par un chemin qui échappe
  // aux enveloppes visuelles.
  useEffect(() => {
    if (!config.demoMode) return;

    const blockSubmit = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("submit", blockSubmit, true);
    return () => document.removeEventListener("submit", blockSubmit, true);
  }, [config.demoMode]);

  const value = useMemo(
    () => ({ ...config, isConfigLoaded }),
    [config, isConfigLoaded],
  );

  return <DemoContext value={value}>{children}</DemoContext>;
}
