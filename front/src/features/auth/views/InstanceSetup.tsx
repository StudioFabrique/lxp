import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { instanceIdentitySchema } from "../../profile/schemas/instance-schema";
import { useFormField } from "../../../components/form/useFormField";
import { showFormErrors } from "../../../components/form/form-errors";
import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
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
import { cn } from "../../../utils/cn";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";
import ThemeSelectionStep from "../../learning-profile/ThemeSelectionStep";

const DEFAULT_NAME = "ANDRIA";
const DEFAULT_LOGO_BACKGROUND = "#ffffff";

export default function InstanceSetup() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const reduceMotion = useReducedMotion();
  const [settings, setSettings] = useState<InstanceSettings | null>(null);
  const form = useForm({
    resolver: zodResolver(instanceIdentitySchema),
    defaultValues: {
      name: DEFAULT_NAME,
      website: "",
      color: DEFAULT_LOGO_BACKGROUND,
    },
  });
  const [name, setName] = useFormField(form, "name");
  const [website, setWebsite] = useFormField(form, "website");
  const websiteError = form.formState.errors.website?.message ?? "";
  const [logo, setLogo] = useState<TemporaryImage>({ file: null, url: null });
  const [logoBackgroundColor, setLogoBackgroundColor] = useFormField(
    form,
    "color",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    profileApi.queries
      .getInstanceSettings()
      .then((current) => {
        if (current.setupCompleted) {
          navigateRef.current("/admin", { replace: true });
          return;
        }
        setSettings(current);
        setName(current.name.trim() || DEFAULT_NAME);
        setWebsite(current.website);
      })
      .catch(() =>
        toast.error("La configuration de l’instance est indisponible."),
      );
  }, [setName, setWebsite]);

  const completeSetup = form.handleSubmit(async (values) => {
    if (!settings || isSaving) return;
    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append("name", values.name);
      payload.append("website", values.website);
      payload.append("setupCompleted", "true");
      payload.append("enabledThemes", JSON.stringify(settings.enabledThemes));
      payload.append("color", values.color);
      if (logo.file) payload.append("image", logo.file);

      await profileApi.mutations.updateInstanceSettings(payload);
      navigate("/admin", { replace: true });
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "La configuration a échoué."));
    } finally {
      setIsSaving(false);
    }
  }, showFormErrors);

  return (
    <motion.div
      className="flex min-h-0 w-full flex-1 flex-col"
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <OnboardingProgressPanel
        contentKey={String(step)}
        currentStep={step}
        stepCount={2}
        progressLabel="Progression de la personnalisation"
        className="min-h-[600px] flex-none lg:min-h-0 lg:flex-1"
        animateProgressOnMount={step === 1}
        progressMountDelay={0.35}
        progressMountDuration={0.9}
        footer={
          step === 1 ? (
            <div className="mt-5 flex justify-end border-t border-base-300 pt-4">
              <button
                type="button"
                className="btn btn-primary text-base normal-case"
                onClick={() => setStep(2)}
              >
                Continuer
              </button>
            </div>
          ) : (
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-base-300 pt-4">
              <button
                type="button"
                className="btn btn-ghost text-base normal-case"
                disabled={isSaving}
                onClick={() => setStep(1)}
              >
                Précédent
              </button>
              <button
                type="submit"
                form="instance-setup-form"
                disabled={!settings || isSaving}
                className="btn btn-primary rounded-lg text-base normal-case text-base-100"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Configuration…" : "Configurer mon espace"}
              </button>
            </div>
          )
        }
      >
        {step === 1 ? (
          <ThemeSelectionStep />
        ) : (
          <AuthPageWrapper
            title="Personnalisez votre espace"
            titleAccessory={
              <Building2 className="mt-0.5 h-6 w-6 text-primary" />
            }
            description="Configurez l’identité de votre organisme. Vous pourrez modifier ces informations plus tard dans les paramètres."
            variant="setup"
          >
            <form
              id="instance-setup-form"
              className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-5"
              noValidate
              onSubmit={completeSetup}
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
                      form.clearErrors("website");
                      setWebsite(event.target.value);
                    }}
                    className={cn(
                      "input input-lg w-full rounded-lg border-none bg-base-200 px-5 text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary",
                      websiteError && "input-error",
                    )}
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
            </form>
          </AuthPageWrapper>
        )}
      </OnboardingProgressPanel>
    </motion.div>
  );
}
