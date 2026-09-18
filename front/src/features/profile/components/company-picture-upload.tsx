import toast from "react-hot-toast";
import { profileApi } from "../api/profile.api";
import ImageFileUpload from "../../../components/UI/image-file-upload/image-file-upload";
import { useCallback, useEffect, useRef, useState } from "react";
import { avatarImageMaxSize } from "../../../config/images-sizes";
import ColorPicker from "../../../components/UI/color-picker";
import { COMPANY_LOGO, COMPANY_LOGO_COLOR } from "../../../config/urls";
import FadeWrapper from "../../../components/wrappers/FadeWrapper";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import TableActionsModal from "../../../components/table/TableActionsModal";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";

const defaultBackgroundColor = "#ffffff";
const validBackgroundColor = /^#[0-9a-f]{6}$/i;

const CompanyPictureUpload = () => {
  const [temporaryAvatar, setTemporaryAvatar] = useState<{
    file: File | null;
    url: string | null;
  }>({ file: null, url: COMPANY_LOGO });

  const [bgColor, setBgColor] = useState(defaultBackgroundColor);
  const [hasLogo, setHasLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [requiresReload, setRequiresReload] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const bgColorRef = useRef(defaultBackgroundColor);
  const hasSelectedColor = useRef(false);

  const saveLogoSettings = useCallback(
    (avatar: { file: File | null; url: string | null }, color: string) => {
      const applyData = ({ message }: { message: string }) => {
        toast.success(message);
      };

      const formData = new FormData();
      if (avatar.file) formData.append("image", avatar.file);
      formData.append("color", color);

      setIsSaving(true);
      profileApi.mutations
        .saveCompanyLogo(formData)
        .then((data) => {
          if (avatar.file) setHasLogo(true);
          setRequiresReload(true);
          applyData(data);
        })
        .catch((err) => {
          const errorMessage =
            err?.response?.data?.message ?? "Erreur inconnue";
          toast.error(errorMessage);
        })
        .finally(() => setIsSaving(false));
    },
    [],
  );

  useEffect(() => {
    if (temporaryAvatar.file) {
      saveLogoSettings(temporaryAvatar, bgColorRef.current);
    }
  }, [temporaryAvatar, saveLogoSettings]);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(COMPANY_LOGO_COLOR, {
      cache: "no-store",
      signal: abortController.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Couleur du logo introuvable");
        return response.text();
      })
      .then((color) => {
        const savedColor = color.trim();
        if (
          validBackgroundColor.test(savedColor) &&
          !hasSelectedColor.current
        ) {
          bgColorRef.current = savedColor;
          setBgColor(savedColor);
        }
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      });

    return () => abortController.abort();
  }, []);

  const handleColorChange = (color: string) => {
    hasSelectedColor.current = true;
    bgColorRef.current = color;
    setBgColor(color);
    saveLogoSettings({ file: null, url: null }, color);
  };

  const handleDeleteLogo = () => {
    setIsDeleting(true);

    profileApi.mutations
      .deleteCompanyLogo()
      .then((data) => {
        hasSelectedColor.current = true;
        bgColorRef.current = defaultBackgroundColor;
        setBgColor(defaultBackgroundColor);
        setTemporaryAvatar({ file: null, url: null });
        setHasLogo(false);
        setRequiresReload(true);
        setShowDeleteConfirmation(false);
        toast.success(data.message);
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message ?? "Erreur inconnue";
        toast.error(errorMessage);
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <BoxWrapper
      className="h-auto gap-6 overflow-visible"
      data-recommended-tour="company-logo"
    >
      <div>
        <h2 className="text-lg font-bold">Logo et apparence</h2>
        <p className="text-sm text-base-content/70">
          Modifiez le logo de l’organisme et son fond d’affichage.
        </p>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <span className="mb-2 block text-sm font-bold">Aperçu du logo</span>
          <div className="max-w-md">
            <ImageFileUpload
              temporaryImage={temporaryAvatar}
              onSetTemporaryImage={setTemporaryAvatar}
              maxSize={avatarImageMaxSize}
              variant="logo"
              previewBackgroundColor={bgColor}
              onPreviewAvailabilityChange={setHasLogo}
            >
              Ajouter un logo
            </ImageFileUpload>
          </div>
          <p className="mt-2 text-xs text-base-content/60">
            JPG ou PNG. Cliquez sur l’aperçu pour remplacer le logo.
          </p>
        </div>

        <div className="flex min-h-32 flex-col">
          <span className="mb-2 block text-sm font-bold">Couleur de fond</span>
          <div>
            <ColorPicker
              defaultColor={bgColor}
              onColorChange={handleColorChange}
            />
          </div>

          {isSaving && (
            <p className="mt-3 flex items-center gap-2 text-xs text-base-content/60">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Enregistrement en cours…
            </p>
          )}

          {hasLogo && (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square text-error"
                onClick={() => setShowDeleteConfirmation(true)}
                disabled={isSaving || isDeleting}
                aria-label="Supprimer le logo"
                title="Supprimer le logo"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      {requiresReload && (
        <FadeWrapper>
          <div className="flex justify-end border-t border-base-300 pt-4">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-ghost btn-sm"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Recharger
            </button>
          </div>
        </FadeWrapper>
      )}

      <TableActionsModal
        isOpen={showDeleteConfirmation}
        onCancel={() => setShowDeleteConfirmation(false)}
        title="Supprimer le logo"
        description="Êtes-vous sûr de vouloir supprimer le logo de l'organisme ?"
        alertMessageBottom="La couleur de fond associée sera également supprimée."
      >
        <button
          type="button"
          className="btn btn-error btn-md"
          onClick={handleDeleteLogo}
          disabled={isDeleting}
        >
          {isDeleting ? "Suppression…" : "Confirmer"}
        </button>
      </TableActionsModal>
    </BoxWrapper>
  );
};

export default CompanyPictureUpload;
