import { Check, LayoutTemplate, Mail, Pencil } from "lucide-react";
import andriaLogo from "../../../assets/andria-logo/logo-lightmode-email.png";
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
  hasInstanceLogo,
  instanceColor,
}: {
  template: (typeof emailTemplates)[number];
  instanceName: string;
  hasInstanceLogo: boolean;
  instanceColor: string;
}) {
  const accent = instanceColor || "#ffffff";
  const mutedColor = "#9ca3af";
  const isEditorial = template.id === "editorial";
  const isCompactHeader = template.id === "gradient";
  const isInvitation = template.id === "soft";
  const isBanner = template.id === "contrast";
  const isBare = template.id === "compact";

  return (
    <div
      className="aspect-[16/11] overflow-hidden p-3"
      style={{ backgroundColor: isInvitation ? accent : isBare ? "#ffffff" : "#f1f5f9" }}
      aria-hidden="true"
    >
      <div
        className={`relative mx-auto flex h-full flex-col bg-white ${isEditorial ? "max-w-64 rounded-none border-y-4" : isBare ? "max-w-64 rounded-none shadow-none" : isInvitation ? "my-1 max-w-52 rounded-2xl shadow-lg" : "max-w-64 rounded-xl shadow-sm"}`}
        style={{
          borderColor: isEditorial ? accent : undefined,
        }}
      >
        <div className={`flex items-center px-4 py-2 ${isBanner ? "min-h-16 justify-center rounded-b-[45%]" : isCompactHeader || isEditorial || isBare ? "min-h-9 justify-start" : "min-h-12 justify-center"}`} style={{ backgroundColor: isEditorial || isInvitation || isBare ? "#ffffff" : accent }}>
          {hasInstanceLogo ? (
            <img
              src={INSTANCE_LOGO}
              alt=""
              className="max-h-7 max-w-24 object-contain"
            />
          ) : (
            <span
              className="truncate text-[8px] font-extrabold uppercase tracking-widest"
              style={{ color: "#111827" }}
            >
              {instanceName || "Votre organisme"}
            </span>
          )}
        </div>
        <div className={`flex flex-1 flex-col px-4 py-3 ${isEditorial || isInvitation || isBanner ? "text-center" : ""}`}>
          {isEditorial && <div className="mb-2 text-[6px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Votre nouvel espace</div>}
          <div className="mb-2 text-[9px] font-bold">Bienvenue parmi nous !</div>
          <div className="space-y-1.5">
            <div className="h-1 w-full rounded bg-current opacity-15" />
            <div className="h-1 w-4/5 rounded bg-current opacity-15" />
          </div>
          <span
            className="mt-3 inline-block w-fit rounded px-3 py-1 text-[6px] font-bold text-white"
            style={{ backgroundColor: accent, alignSelf: isEditorial || isInvitation || isBanner ? "center" : undefined, color: "#111827" }}
          >
            Découvrir mon espace
          </span>
          <div className="mt-auto flex items-end justify-between border-t pt-2" style={{ borderColor: mutedColor }}>
            <span className="max-w-24 truncate text-[6px]" style={{ color: mutedColor }}>
              {instanceName || "Votre organisme"}
            </span>
            <img src={andriaLogo} alt="" className="h-auto w-10 object-contain" />
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
