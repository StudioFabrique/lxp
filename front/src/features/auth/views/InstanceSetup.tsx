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
  const [website, setWebsite] = useState("");
  const [websiteError, setWebsiteError] = useState("");
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
        setWebsite(current.website);
      })
      .catch(() =>
        toast.error("La configuration de l’instance est indisponible."),
      );
  }, [navigate]);

  const completeSetup = async () => {
    if (!settings || isSaving) return;

    const organizationName = name.trim();
    if (organizationName.length < 2) {
      toast.error("Le nom de l’organisme doit contenir au moins 2 caractères.");
      return;
    }
    const organizationWebsite = website.trim();
    if (organizationWebsite) {
      try {
        const parsedWebsite = new URL(organizationWebsite);
        if (!["http:", "https:"].includes(parsedWebsite.protocol))
          throw new Error();
      } catch {
        setWebsiteError(
          "Saisissez une adresse complète commençant par http:// ou https://.",
        );
        return;
      }
    }
    setWebsiteError("");

    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append("name", organizationName);
      payload.append("website", organizationWebsite);
      payload.append("setupCompleted", "true");
      payload.append("enabledThemes", JSON.stringify(settings.enabledThemes));
      payload.append("color", logoBackgroundColor);
      if (logo.file) payload.append("image", logo.file);

      await profileApi.mutations.updateInstanceSettings(payload);
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
      description="Configurez l’identité de votre organisme. Vous pourrez modifier ces informations plus tard dans les paramètres."
    >
      <form
        className="mx-auto flex w-full max-w-xl flex-col items-center gap-5"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void completeSetup();
        }}
      >
        <label className="flex w-full flex-col gap-2 text-center">
          <span className="text-sm font-semibold text-base-content">
            Nom de l’organisme
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

        <div className="grid w-full gap-5 sm:grid-cols-2 sm:items-start">
          <label className="flex min-w-0 flex-col gap-2 text-center">
            <span className="text-sm font-semibold text-base-content">
              Site internet{" "}
              <span className="font-normal text-base-content/60">
                (optionnel)
              </span>
            </span>
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              value={website}
              maxLength={2048}
              placeholder="https://www.exemple.fr"
              disabled={!settings || isSaving}
              aria-invalid={Boolean(websiteError)}
              aria-describedby={
                websiteError ? "setup-website-error" : undefined
              }
              onChange={(event) => {
                if (websiteError) setWebsiteError("");
                setWebsite(event.target.value);
              }}
              className={`input input-lg w-full rounded-lg border-none bg-base-200 px-5 text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary ${websiteError ? "input-error" : ""}`}
            />
            {websiteError && (
              <span
                id="setup-website-error"
                className="text-left text-sm text-error"
              >
                {websiteError}
              </span>
            )}
          </label>

          <InstanceLogoControls
            temporaryImage={logo}
            onSetTemporaryImage={setLogo}
            backgroundColor={logoBackgroundColor}
            onBackgroundColorChange={setLogoBackgroundColor}
            optional
            helpText="JPG ou PNG, 500 Ko maximum."
          />
        </div>

        <button
          type="submit"
          disabled={!settings || isSaving}
          className="btn btn-primary mt-2 w-full rounded-lg text-base normal-case text-base-100"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Configuration…" : "Configurer mon espace"}
        </button>
      </form>
    </AuthPageWrapper>
  );
}
