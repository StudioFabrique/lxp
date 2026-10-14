import { createPortal } from "react-dom";
import { Check, LayoutTemplate, Mail, Pencil } from "lucide-react";
import Modal from "../../../components/UI/modal/modal";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { cn } from "../../../utils/cn";
import { emailTemplates } from "./email-template-settings.utils";
import { EmailPreview } from "./email-preview";

export type EmailTemplateId = (typeof emailTemplates)[number]["id"];

type Props = {
  selectedTemplate: EmailTemplateId;
  draftTemplate: EmailTemplateId;
  instanceName: string;
  website: string;
  hasInstanceLogo: boolean;
  instanceColor: string;
  instanceLogoUrl?: string;
  disabled?: boolean;
  isOpen: boolean;
  isSaving: boolean;
  isSendingTest?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (template: EmailTemplateId) => void;
  onSave: () => void;
  onSendTest?: () => void;
};

// Selon la largeur de la carte (et non de l’écran), les boutons se réduisent à leur icône ; le libellé reste lisible par les lecteurs d’écran.
const actionButtonClassName = "@max-xl:btn-square";
const actionLabelClassName = "sr-only @xl:not-sr-only";

const templateName = (id: EmailTemplateId) =>
  emailTemplates.find((template) => template.id === id)?.name ?? id;

export default function EmailTemplateSettings(props: Props) {
  return (
    <>
      <BoxWrapper className="@container h-auto w-full shrink-0 overflow-visible">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <span className="shrink-0 rounded-xl bg-primary/10 p-3 text-primary">
              <LayoutTemplate className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Template de l’e-mail</h2>
              <p className="text-sm text-base-content/70">
                Modèle sélectionné : <span className="font-semibold text-base-content">{templateName(props.selectedTemplate)}</span>
              </p>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap justify-end gap-2">
            {props.onSendTest && <button type="button" className={cn("btn btn-outline btn-primary normal-case", actionButtonClassName)} onClick={props.onSendTest} disabled={props.disabled || props.isSaving || props.isSendingTest}>
              <Mail className={cn("size-4", props.isSendingTest && "animate-pulse")} aria-hidden="true" />
              <span className={actionLabelClassName}>{props.isSendingTest ? "Envoi…" : "Envoyer un e-mail de test"}</span>
            </button>}
            <button type="button" className={cn("btn btn-primary normal-case", actionButtonClassName)} onClick={props.onOpen} disabled={props.disabled || props.isSaving}>
              <Pencil className="size-4" aria-hidden="true" />
              <span className={actionLabelClassName}>Modifier le template</span>
            </button>
          </div>
        </div>
      </BoxWrapper>

      {props.isOpen && createPortal(
        <Modal
          title="Choisir un template d’e-mail"
          leftLabel="Annuler"
          rightLabel="Appliquer le template"
          onLeftClick={props.onClose}
          onRightClick={props.onSave}
          isSubmitting={props.isSaving}
          rightDisabled={props.draftTemplate === props.selectedTemplate}
          rightClassName="btn-primary"
          modalBoxStyle="w-11/12 max-w-3xl"
        >
          <p className="mt-2 text-sm text-base-content/65">
            Sélectionnez le style utilisé pour les e-mails envoyés par votre instance.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {emailTemplates.map((template) => {
              const selected = props.draftTemplate === template.id;
              return (
                <button
                  key={template.id}
                  type="button"
                  aria-label={template.name}
                  aria-pressed={selected}
                  onClick={() => props.onSelect(template.id)}
                  className={cn("group overflow-hidden rounded-2xl border-2 bg-base-100 text-left transition hover:-translate-y-0.5 hover:shadow-lg", selected ? "border-primary ring-2 ring-primary/20" : "border-base-300")}
                >
                  {/* zoom réduit l’aperçu en conservant ses proportions internes et sa hauteur dans le flux. */}
                  <div className="[zoom:0.5]">
                    <EmailPreview
                      template={template}
                      instanceName={props.instanceName}
                      website={props.website}
                      hasInstanceLogo={props.hasInstanceLogo}
                      instanceColor={props.instanceColor}
                      instanceLogoUrl={props.instanceLogoUrl}
                    />
                  </div>
                  <span className="flex items-center justify-between px-3 py-2 text-sm font-bold">
                    {template.name}
                    <span className={cn("flex size-6 items-center justify-center rounded-full", selected ? "bg-primary text-primary-content" : "bg-base-200 text-transparent")}>
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Modal>,
        document.body,
      )}
    </>
  );
}
