import { useEffect, useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { type TemporaryImage } from "../../../components/UI/image-file-upload/image-file-upload";
import InstanceLogoControls from "../../../components/UI/instance-logo-controls";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import {
  profileApi,
  type InstanceSettings,
} from "../../profile/api/profile.api";
import AuthPageWrapper from "../components/AuthPageWrapper";

const DEFAULT_NAME = "ANDRIA";
const DEFAULT_LOGO_BACKGROUND = "#ffffff";

export default function InstanceSetup() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<InstanceSettings | null>(null);
  const [name, setName] = useState(DEFAULT_NAME);
  const [logo, setLogo] = useState<TemporaryImage>({ file: null, url: null });
  const [logoBackgroundColor, setLogoBackgroundColor] = useState(
    DEFAULT_LOGO_BACKGROUND,
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    profileApi.queries
      .getInstanceSettings()
      .then((current) => {
        if (current.setupCompleted) {
          navigate("/admin", { replace: true });
          return;
        }
        setSettings(current);
        setName(current.name.trim() || DEFAULT_NAME);
      })
      .catch(() =>
        toast.error("La configuration de l’instance est indisponible."),
      );
  }, [navigate]);

  const completeSetup = async (useDefaults = false) => {
    if (!settings || isSaving) return;

    const organizationName = useDefaults ? DEFAULT_NAME : name.trim();
    if (organizationName.length < 2) {
      toast.error(
        "Le nom de l’organisation doit contenir au moins 2 caractères.",
      );
      return;
    }

    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append("name", organizationName);
      payload.append("setupCompleted", "true");
      payload.append("defaultTheme", settings.defaultTheme);
      payload.append("welcomeTitles", JSON.stringify(settings.welcomeTitles));
      payload.append(
        "welcomeMessages",
        JSON.stringify(settings.welcomeMessages),
      );
      payload.append(
        "color",
        useDefaults ? DEFAULT_LOGO_BACKGROUND : logoBackgroundColor,
      );
      if (!useDefaults && logo.file) payload.append("image", logo.file);

      await profileApi.mutations.updateInstanceSettings(payload);
      toast.success("Votre espace est prêt.");
      navigate("/admin", { replace: true });
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "La configuration a échoué."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthPageWrapper
      title="Personnalisez votre espace"
      titleAccessory={<Building2 className="mt-0.5 h-6 w-6 text-primary" />}
      description="Configurez l’identité de votre organisation. Vous pourrez modifier ces informations plus tard dans les paramètres."
    >
      <form
        className="mx-auto flex w-full max-w-sm flex-col items-center gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          void completeSetup();
        }}
      >
        <label className="flex w-full flex-col gap-2 text-center">
          <span className="text-sm font-semibold text-base-content">
            Nom de l’organisation
          </span>
          <input
            type="text"
            value={name}
            maxLength={80}
            disabled={!settings || isSaving}
            onChange={(event) => setName(event.target.value)}
            className="input input-lg w-full rounded-lg border-none bg-base-200 px-5 text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <InstanceLogoControls
          temporaryImage={logo}
          onSetTemporaryImage={setLogo}
          backgroundColor={logoBackgroundColor}
          onBackgroundColorChange={setLogoBackgroundColor}
          optional
          helpText="JPG ou PNG · 500 Ko maximum."
        />

        <button
          type="submit"
          disabled={!settings || isSaving}
          className="btn btn-primary mt-2 w-full rounded-lg text-base normal-case text-base-100"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Configuration…" : "Configurer mon espace"}
        </button>

        <button
          type="button"
          disabled={!settings || isSaving}
          onClick={() => void completeSetup(true)}
          className="btn btn-ghost btn-sm w-full normal-case text-base-content/70"
        >
          Continuer avec ANDRIA
        </button>
      </form>
    </AuthPageWrapper>
  );
}
