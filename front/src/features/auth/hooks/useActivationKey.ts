import { useEffect, useState } from "react";
import { onboardingApi } from "../api/onboarding.api";

const localCommand = "npm run generate-activation-key";
const activationKeyCommand = (containerId?: string) => import.meta.env.PROD
  ? `docker exec ${containerId ?? "<conteneur>"} ${localCommand}` : localCommand;

export default function useActivationKey() {
  const [containerId, setContainerId] = useState<string>();
  const [activationTokenTtlMinutes, setActivationTokenTtlMinutes] = useState(30);
  const [isCommandCopied, setIsCommandCopied] = useState(false);
  const command = activationKeyCommand(containerId);
  useEffect(() => {
    let active = true;
    onboardingApi.getSetupStatus().then((status) => {
      if (!active) return;
      setContainerId(status.containerId);
      setActivationTokenTtlMinutes(status.activationTokenTtlMinutes);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setIsCommandCopied(true);
      window.setTimeout(() => setIsCommandCopied(false), 2000);
    } catch (error) { console.error("Échec de la copie de la commande :", error); }
  };
  return { command, activationTokenTtlMinutes, isCommandCopied, handleCopyCommand };
}
