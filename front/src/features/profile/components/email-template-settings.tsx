import { Check, LayoutTemplate, Mail, Pencil } from "lucide-react";
import andriaLogo from "../../../assets/andria-logo/logo-lightmode-email.png";
import andriaLogoLight from "../../../assets/andria-logo/logo-darkmode-email.png";
import { INSTANCE_LOGO } from "../../../config/urls";
import Modal from "../../../components/UI/modal/modal";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";

const emailTemplates = [
  { id: "minimal", name: "Classique" },
  { id: "gradient", name: "En-tête compact" },
  { id: "editorial", name: "Éditorial" },
  { id: "soft", name: "Invitation" },
  { id: "contrast", name: "Bannière" },
  { id: "compact", name: "Épuré" },
] as const;

export type EmailTemplateId = (typeof emailTemplates)[number]["id"];

type Props = {
  selectedTemplate: EmailTemplateId;
  draftTemplate: EmailTemplateId;
  instanceName: string;
  website: string;
  hasInstanceLogo: boolean;
  instanceColor: string;
  isOpen: boolean;
  isSaving: boolean;
  isSendingTest: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (template: EmailTemplateId) => void;
  onSave: () => void;
  onSendTest: () => void;
};

const templateName = (id: EmailTemplateId) =>
  emailTemplates.find((template) => template.id === id)?.name ?? id;

function EmailPreview({
  template,
  instanceName,
  website,
  hasInstanceLogo,
  instanceColor,
}: {
  template: (typeof emailTemplates)[number];
  instanceName: string;
  website: string;
  hasInstanceLogo: boolean;
  instanceColor: string;
}) {
  const configuredAccent = instanceColor || "#ffffff";
  const accent = /^#(?:fff|ffffff)$/i.test(configuredAccent)
    ? "#1769aa"
    : configuredAccent;
  const colorLuminance = (color: string) => {
    const channels = color.slice(1).match(/.{2}/g)?.map((value) => {
      const channel = Number.parseInt(value, 16) / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return channels?.length === 3
      ? 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
      : 1;
  };
  const cornerColor = colorLuminance(configuredAccent) < 0.88
    ? configuredAccent
    : "#1769aa";
  const cornerLogo = colorLuminance(cornerColor) < 0.45
    ? andriaLogoLight
    : andriaLogo;
  const accentTextColor = colorLuminance(accent) > 0.45
    ? "#17202a"
    : "#ffffff";
  const mutedColor = "#9ca3af";
  const isEditorial = template.id === "editorial";
  const isInvitation = template.id === "soft";
  const isBanner = template.id === "contrast";
  const isBare = template.id === "compact";

  return (
    <div
      className="aspect-[16/11] overflow-hidden p-3"
      style={{ backgroundColor: isInvitation ? `${accent}20` : isBare ? "#ffffff" : "#f1f5f9" }}
      aria-hidden="true"
    >
      <div
        className={`relative mx-auto flex h-full flex-col bg-white text-[#17202a] ${isEditorial ? "max-w-64 rounded-none border-y-4" : isBare ? "max-w-64 rounded-none shadow-none" : isInvitation ? "my-1 max-w-52 rounded-2xl shadow-lg" : "max-w-64 rounded-xl shadow-sm"}`}
        style={{
          borderColor: isEditorial ? accent : undefined,
        }}
      >
        {template.id === "gradient" && (
          <div className="h-1.5 shrink-0" style={{ backgroundColor: accent }} />
        )}
        {isBanner && (
          <div
            className="flex h-12 shrink-0 items-center justify-center px-4"
            style={{ backgroundColor: hasInstanceLogo ? configuredAccent : accent }}
          >
            {hasInstanceLogo ? (
              <img src={INSTANCE_LOGO} alt="" className="h-auto max-h-8 w-14 object-contain" />
            ) : (
              <span className="text-[9px] font-bold text-white">
                {instanceName || "Votre organisme"}
              </span>
            )}
          </div>
        )}
        <div className={`flex flex-1 flex-col px-4 py-3 ${isEditorial || isInvitation || isBanner ? "text-center" : ""}`}>
          <div className="mb-2 text-[9px] font-bold">Bienvenue parmi nous !</div>
          <div className="space-y-1.5">
            <div className="h-1 w-full rounded bg-current opacity-15" />
            <div className="h-1 w-4/5 rounded bg-current opacity-15" />
          </div>
          <span
            className="mt-3 inline-block w-fit rounded px-3 py-1 text-[6px] font-bold text-white"
            style={{ backgroundColor: accent, alignSelf: isEditorial || isInvitation || isBanner ? "center" : undefined, color: accentTextColor }}
          >
            Découvrir mon espace
          </span>
          <div
            className={`mt-auto flex items-start justify-between ${isBanner ? "-mb-3 -mr-4" : "border-t pt-2"}`}
            style={{ borderColor: mutedColor }}
          >
            {isBanner ? (
              <span className="max-w-24 truncate text-[6px] underline" style={{ color: mutedColor }}>
                {website}
              </span>
            ) : hasInstanceLogo ? (
              <span className="flex flex-col items-start gap-1">
                <img src={INSTANCE_LOGO} alt="" className="h-auto max-h-5 w-10 object-contain" />
                {website && <span className="max-w-24 truncate text-[6px] underline" style={{ color: mutedColor }}>{website}</span>}
              </span>
            ) : (
              <span className="flex max-w-24 flex-col text-[6px]" style={{ color: mutedColor }}>
                <span className="truncate">{instanceName || "Votre organisme"}</span>
                {website && <span className="truncate underline">{website}</span>}
              </span>
            )}
            <span
              className={isBanner ? "rounded-tl-lg px-3 py-2" : undefined}
              style={{ backgroundColor: isBanner ? cornerColor : undefined }}
            >
              <img src={isBanner ? cornerLogo : andriaLogo} alt="" className="h-auto w-10 object-contain" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailTemplateSettings(props: Props) {
  return (
    <>
      <BoxWrapper className="h-auto w-full overflow-visible">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="rounded-xl bg-primary/10 p-3 text-primary">
              <LayoutTemplate className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Template de l’e-mail</h2>
              <p className="text-sm text-base-content/70">
                Modèle sélectionné : <span className="font-semibold text-base-content">{templateName(props.selectedTemplate)}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline btn-primary normal-case" onClick={props.onSendTest} disabled={props.isSendingTest}>
              <Mail className={`size-4 ${props.isSendingTest ? "animate-pulse" : ""}`} aria-hidden="true" />
              {props.isSendingTest ? "Envoi…" : "Envoyer un e-mail de test"}
            </button>
            <button type="button" className="btn btn-primary normal-case" onClick={props.onOpen}>
              <Pencil className="size-4" aria-hidden="true" />
              Modifier le template
            </button>
          </div>
        </div>
      </BoxWrapper>

      {props.isOpen && (
        <Modal
          title="Choisir un template d’e-mail"
          leftLabel="Annuler"
          rightLabel="Appliquer le template"
          onLeftClick={props.onClose}
          onRightClick={props.onSave}
          isSubmitting={props.isSaving}
          rightDisabled={props.draftTemplate === props.selectedTemplate}
          rightClassName="btn-primary"
          modalBoxStyle="w-11/12 max-w-6xl"
        >
          <p className="mt-2 text-sm text-base-content/65">
            Sélectionnez le style utilisé pour les e-mails envoyés par votre instance.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {emailTemplates.map((template) => {
              const selected = props.draftTemplate === template.id;
              return (
                <button
                  key={template.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => props.onSelect(template.id)}
                  className={`group overflow-hidden rounded-2xl border-2 bg-base-100 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${selected ? "border-primary ring-2 ring-primary/20" : "border-base-300"}`}
                >
                  <EmailPreview
                    template={template}
                    instanceName={props.instanceName}
                    website={props.website}
                    hasInstanceLogo={props.hasInstanceLogo}
                    instanceColor={props.instanceColor}
                  />
                  <span className="flex items-center justify-between px-4 py-3 text-sm font-bold">
                    {template.name}
                    <span className={`flex size-6 items-center justify-center rounded-full ${selected ? "bg-primary text-primary-content" : "bg-base-200 text-transparent"}`}>
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </>
  );
}
