import toast from "react-hot-toast";
import apiClient from "../../../lib/axios";
import ProfileImageFileUpload from "../../../components/UI/image-file-upload/profile-image-file-upload";
import { useCallback, useEffect, useRef, useState } from "react";
import { avatarImageMaxSize } from "../../../config/images-sizes";
import ColorPicker from "../../../components/UI/color-picker";
import { COMPANY_LOGO, COMPANY_LOGO_COLOR } from "../../../config/urls";
import FadeWrapper from "../../../components/wrappers/FadeWrapper";
import TableActionsModal from "../../../components/table/TableActionsModal";
import { Trash2 } from "lucide-react";

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
      apiClient
        .post(`/company-logo`, formData)
        .then((response) => {
          if (avatar.file) setHasLogo(true);
          setRequiresReload(true);
          applyData(response.data);
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
        if (error instanceof DOMException && error.name === "AbortError") return;
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

    apiClient
      .delete("/company-logo")
      .then((response) => {
        hasSelectedColor.current = true;
        bgColorRef.current = defaultBackgroundColor;
        setBgColor(defaultBackgroundColor);
        setTemporaryAvatar({ file: null, url: null });
        setHasLogo(false);
        setRequiresReload(true);
        setShowDeleteConfirmation(false);
        toast.success(response.data.message);
      })
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.message ?? "Erreur inconnue";
        toast.error(errorMessage);
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <div className="card h-full">
      <div className="card-body p-6">
        {/* Header */}
        <h2 className="card-title text-lg font-medium mb-4">
          Logo de l'organisme
        </h2>

        {/* Main */}
        <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
          {/* Left color picker */}
          <div className="flex flex-col gap-3 items-center md:items-start w-full md:w-auto">
            <span className="label-text font-semibold">Arrière-plan</span>
            <ColorPicker
              defaultColor={bgColor}
              onColorChange={handleColorChange}
            />
            {!temporaryAvatar.file && (
              <p className="text-xs text-base-content/60 italic">
                Formats : .jpg, .jpeg, .png
              </p>
            )}
          </div>

          {/* Right image upload */}
          <div className="flex w-full min-w-0 flex-col items-center gap-3">
            <ProfileImageFileUpload
              temporaryAvatar={temporaryAvatar}
              onSetTemporaryAvatar={setTemporaryAvatar}
              maxSize={avatarImageMaxSize}
              variant="logo"
              previewBackgroundColor={bgColor}
              onPreviewAvailabilityChange={setHasLogo}
            >
              Ajouter le logo
            </ProfileImageFileUpload>
            {hasLogo && (
              <button
                type="button"
                className="btn btn-error btn-outline btn-sm"
                onClick={() => setShowDeleteConfirmation(true)}
                disabled={isSaving || isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer le logo
              </button>
            )}
          </div>
        </div>

        {/* Feedback */}
        {requiresReload && (
          <FadeWrapper>
            <div className="alert alert-success mt-6 py-2 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <span>
                  Rechargement requis pour répercuter les modifications du
                  logo
                </span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-sm btn-ghost"
              >
                Recharger
              </button>
            </div>
          </FadeWrapper>
        )}

        <TableActionsModal
          isOpen={showDeleteConfirmation}
          onCancel={() => setShowDeleteConfirmation(false)}
          title="Supprimer le logo"
          description="Êtes-vous sûr de vouloir supprimer le logo de l’organisme ?"
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
      </div>
    </div>
  );
};

export default CompanyPictureUpload;
