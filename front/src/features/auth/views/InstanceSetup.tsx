import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  instanceSetupSchema,
  type InstanceSetupValues,
} from "../schemas/instance-setup.schema";
import { profileKeys } from "../../profile/api/profile.keys";
import { useFormField } from "../../../components/form/useFormField";
import { showFormErrors } from "../../../components/form/form-errors";
import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Building2, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import InstanceLogoControls from "../../../components/UI/instance-logo-controls";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import { profileApi } from "../../profile/api/profile.api";
import AuthPageWrapper from "../components/AuthPageWrapper";
import { cn } from "../../../utils/cn";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";
import ThemeSelectionStep from "../../learning-profile/ThemeSelectionStep";
import EmailTemplateSettings, {
  type EmailTemplateId,
} from "../../profile/components/email-template-settings";

const DEFAULT_NAME = "ANDRIA";
const DEFAULT_LOGO_BACKGROUND = "#ffffff";

export default function InstanceSetup() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({
    queryKey: profileKeys.instanceSettings(),
    queryFn: profileApi.queries.getInstanceSettings,
  });
  const settings = settingsQuery.data;
  const form = useForm<InstanceSetupValues>({
    resolver: zodResolver(instanceSetupSchema),
    defaultValues: {
      name: DEFAULT_NAME,
      website: "",
      color: DEFAULT_LOGO_BACKGROUND,
      emailTemplate: "minimal",
      logo: { file: null, url: null },
    },
  });
  const [name, setName] = useFormField(form, "name");
  const [website, setWebsite] = useFormField(form, "website");
  const nameError = form.formState.errors.name?.message;
  const websiteError = form.formState.errors.website?.message ?? "";
  const [logo, setLogo] = useFormField(form, "logo");
  const [emailTemplate, setEmailTemplate] = useFormField(form, "emailTemplate");
  const [draftEmailTemplate, setDraftEmailTemplate] =
    useState<EmailTemplateId>("minimal");
  const [isEmailTemplateModalOpen, setIsEmailTemplateModalOpen] = useState(false);
  const [logoBackgroundColor, setLogoBackgroundColor] = useFormField(
    form,
    "color",
  );
  const [step, setStep] = useState(1);
  const initialized = useRef(false);
  const { reset } = form;

  useEffect(() => {
    if (!settings || initialized.current) return;
    if (settings.setupCompleted) {
      navigate("/admin", { replace: true });
      return;
    }
    initialized.current = true;
    reset({
      name: settings.name.trim() || DEFAULT_NAME,
      website: settings.website,
      color: DEFAULT_LOGO_BACKGROUND,
      emailTemplate: settings.emailTemplate,
      logo: { file: null, url: null },
    });
  }, [settings, reset, navigate]);

  const saveMutation = useMutation({
    mutationFn: profileApi.mutations.updateInstanceSettings,
    onSuccess: (saved) => {
      queryClient.setQueryData(profileKeys.instanceSettings(), saved);
      void queryClient.invalidateQueries({ queryKey: profileKeys.instanceLogo() });
      navigate("/admin", { replace: true });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "La configuration a échoué."));
    },
  });
  const isSaving = saveMutation.isPending || form.formState.isSubmitting;
  const completeSetup = form.handleSubmit(async (values) => {
    if (!settings || saveMutation.isPending) return;
    const payload = new FormData();
    payload.append("name", values.name);
    payload.append("website", values.website);
    payload.append("setupCompleted", "true");
    payload.append("enabledThemes", JSON.stringify(settings.enabledThemes));
    payload.append("color", values.color);
    payload.append("emailTemplate", values.emailTemplate);
    if (values.logo.file) payload.append("image", values.logo.file);
    await saveMutation.mutateAsync(payload).catch(() => undefined);
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
                {isSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}
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
            {settingsQuery.isError && (
              <div role="alert" className="alert alert-error mb-4">
                <span>La configuration de l’instance est indisponible.</span>
                <button type="button" className="btn btn-sm" onClick={() => void settingsQuery.refetch()}>Réessayer</button>
              </div>
            )}
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
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "setup-name-error" : undefined}
                  disabled={!settings || isSaving}
                  onChange={(event) => setName(event.target.value)}
                  className="input input-lg w-full rounded-lg border-none bg-base-200 px-5 text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {nameError && <span id="setup-name-error" className="text-sm text-error">{nameError}</span>}
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
            <div className="mx-auto mt-5 w-full max-w-xl shrink-0">
              <EmailTemplateSettings
                selectedTemplate={emailTemplate}
                draftTemplate={draftEmailTemplate}
                instanceName={name}
                website={website}
                hasInstanceLogo={Boolean(logo.url) || Boolean(settings?.hasLogo)}
                instanceLogoUrl={logo.url ?? undefined}
                instanceColor={logoBackgroundColor}
                isOpen={isEmailTemplateModalOpen}
                isSaving={isSaving}
                disabled={!settings || isSaving}
                onOpen={() => {
                  setDraftEmailTemplate(emailTemplate);
                  setIsEmailTemplateModalOpen(true);
                }}
                onClose={() => setIsEmailTemplateModalOpen(false)}
                onSelect={setDraftEmailTemplate}
                onSave={() => {
                  setEmailTemplate(draftEmailTemplate);
                  setIsEmailTemplateModalOpen(false);
                }}
              />
            </div>
          </AuthPageWrapper>
        )}
      </OnboardingProgressPanel>
    </motion.div>
  );
}
