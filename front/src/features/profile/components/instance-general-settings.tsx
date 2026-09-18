import { useContext, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import ColorPicker from "../../../components/UI/color-picker";
import ImageFileUpload, {
  type TemporaryImage,
} from "../../../components/UI/image-file-upload/image-file-upload";
import { avatarImageMaxSize } from "../../../config/images-sizes";
import { INSTANCE_LOGO, INSTANCE_LOGO_COLOR } from "../../../config/urls";
import { darkThemes, lightThemes } from "../../../config/themes";
import { ThemeContext } from "../../../store/ThemeProvider";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import { profileApi, type InstanceSettings } from "../api/profile.api";
import ThemeSelect from "./theme-select";
import QuestionMarkTooltip from "../../../components/UI/question-mark-tooltip/question-mark-tooltip";

const emptySettings: InstanceSettings = {
  name: "",
  setupCompleted: true,
  hasLogo: false,
  defaultTheme: "classic",
  welcomeTitles: { admin: "", teacher: "", student: "" },
  welcomeMessages: { admin: "", teacher: "", student: "" },
};

const messageFields = [
  ["admin", "Administrateurs"],
  ["teacher", "Équipe pédagogique"],
  ["student", "Apprenants"],
] as const;

const defaultBackgroundColor = "#ffffff";
const validBackgroundColor = /^#[0-9a-f]{6}$/i;

export default function InstanceGeneralSettings() {
  const { chooseTheme } = useContext(ThemeContext);
  const [settings, setSettings] = useState(emptySettings);
  const [initialSettings, setInitialSettings] = useState(emptySettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logo, setLogo] = useState<TemporaryImage>({
    file: null,
    url: INSTANCE_LOGO,
  });
  const [hasLogo, setHasLogo] = useState(false);
  const [deleteLogo, setDeleteLogo] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(
    defaultBackgroundColor,
  );
  const [initialBackgroundColor, setInitialBackgroundColor] = useState(
    defaultBackgroundColor,
  );
  const [lightPreviewTheme, setLightPreviewTheme] = useState(
    () => localStorage.getItem("lightTheme") ?? "classic",
  );
  const [darkPreviewTheme, setDarkPreviewTheme] = useState(
    () => localStorage.getItem("darkTheme") ?? "classic-dark",
  );

  useEffect(() => {
    profileApi.queries
      .getInstanceSettings()
      .then((data) => {
        setSettings(data);
        setInitialSettings(data);
        if (
          lightThemes.includes(
            data.defaultTheme as (typeof lightThemes)[number],
          )
        ) {
          setLightPreviewTheme(data.defaultTheme);
        }
        if (
          darkThemes.includes(data.defaultTheme as (typeof darkThemes)[number])
        ) {
          setDarkPreviewTheme(data.defaultTheme);
        }
      })
      .catch(() =>
        toast.error("Les paramètres de l’instance sont indisponibles."),
      )
      .finally(() => setIsLoading(false));

    const abortController = new AbortController();
    fetch(INSTANCE_LOGO_COLOR, {
      cache: "no-store",
      signal: abortController.signal,
    })
      .then((response) =>
        response.ok ? response.text() : defaultBackgroundColor,
      )
      .then((color) => {
        const savedColor = color.trim();
        if (validBackgroundColor.test(savedColor)) {
          setBackgroundColor(savedColor);
          setInitialBackgroundColor(savedColor);
        }
      })
      .catch(() => undefined);

    return () => abortController.abort();
  }, []);

  const save = async (scope: "identity" | "interface" | "messages") => {
    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append(
        "name",
        scope === "identity" ? settings.name : initialSettings.name,
      );
      payload.append(
        "defaultTheme",
        scope === "interface"
          ? settings.defaultTheme
          : initialSettings.defaultTheme,
      );
      payload.append(
        "welcomeTitles",
        JSON.stringify(
          scope === "messages"
            ? settings.welcomeTitles
            : initialSettings.welcomeTitles,
        ),
      );
      payload.append(
        "welcomeMessages",
        JSON.stringify(
          scope === "messages"
            ? settings.welcomeMessages
            : initialSettings.welcomeMessages,
        ),
      );
      payload.append(
        "color",
        scope === "identity" ? backgroundColor : initialBackgroundColor,
      );
      payload.append("deleteLogo", String(scope === "identity" && deleteLogo));
      if (scope === "identity" && logo.file) payload.append("image", logo.file);

      await profileApi.mutations.updateInstanceSettings(payload);
      window.location.reload();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "L’enregistrement a échoué."));
    } finally {
      setIsSaving(false);
    }
  };

  const previewTheme = (theme: string, mode: "light" | "dark") => {
    if (mode === "light") setLightPreviewTheme(theme);
    else setDarkPreviewTheme(theme);
    setSettings((current) => ({ ...current, defaultTheme: theme }));
    chooseTheme(theme, mode);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-stretch gap-4 xl:grid-cols-2">
        <BoxWrapper
          className="h-auto gap-6 overflow-visible"
          data-recommended-tour="instance-logo"
        >
        <form
          className="flex h-full flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            void save("identity");
          }}
        >
          <div>
            <h2 className="text-lg font-bold">Identité de l’organisme</h2>
            <p className="text-sm text-base-content/70">
              Personnalisez le nom, le logo et son fond d’affichage.
            </p>
          </div>

          <fieldset
            disabled={isLoading || isSaving}
            className="flex flex-col gap-6"
          >
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold">Nom de l’organisme</span>
              <input
                className="input input-bordered w-full max-w-xl focus:outline-none"
                value={settings.name}
                maxLength={80}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </label>

            <div className="flex w-full min-w-0 max-w-md flex-col gap-5 self-end">
              <div>
                <span className="mb-2 block text-sm font-bold">Logo</span>
                <div className="max-w-md">
                  <ImageFileUpload
                    temporaryImage={logo}
                    onSetTemporaryImage={(image) => {
                      setLogo(image);
                      setDeleteLogo(false);
                    }}
                    maxSize={avatarImageMaxSize}
                    variant="logo"
                    previewBackgroundColor={backgroundColor}
                    onPreviewAvailabilityChange={setHasLogo}
                  >
                    Ajouter un logo
                  </ImageFileUpload>
                </div>
                <div className="mt-2 flex max-w-md items-start justify-between gap-3">
                  <p className="text-xs text-base-content/60">
                    JPG ou PNG. Le changement sera appliqué à la sauvegarde.
                  </p>
                  {hasLogo && !deleteLogo && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-square shrink-0 text-error"
                      onClick={() => {
                        setLogo({ file: null, url: null });
                        setHasLogo(false);
                        setDeleteLogo(true);
                      }}
                      aria-label="Supprimer le logo"
                      title="Supprimer le logo"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-bold">
                  Couleur de fond du logo
                </span>
                <ColorPicker
                  defaultColor={backgroundColor}
                  onColorChange={setBackgroundColor}
                />
                <p className="mt-2 text-xs text-base-content/60">
                  La couleur sélectionnée est visible directement dans l’aperçu.
                </p>
              </div>
            </div>
          </fieldset>

          <div className="mt-auto flex justify-end pt-5">
            <button
              type="submit"
              className="btn btn-primary min-w-32 normal-case"
              disabled={isLoading || isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Sauvegarde…" : "Sauvegarder"}
            </button>
          </div>
        </form>
        </BoxWrapper>

        <BoxWrapper className="h-auto gap-6 overflow-visible">
        <form
          className="flex h-full flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            void save("interface");
          }}
        >
          <div>
            <h2 className="text-lg font-bold">
              Personnalisation de l’interface
            </h2>
            <p className="text-sm text-base-content/70">
              Définissez le thème initial de l’interface.
            </p>
          </div>

          <fieldset
            disabled={isLoading || isSaving}
            className="flex flex-col gap-5"
          >
            <div>
              <span className="mb-2 block text-sm font-bold">
                Thème par défaut
              </span>
              <div className="flex max-w-2xl flex-col gap-3">
                <div className="rounded-lg border border-base-300 bg-base-100 px-3 py-2">
                  <ThemeSelect
                    label="Thème clair"
                    themesList={lightThemes}
                    selectedTheme={lightPreviewTheme}
                    onThemeChange={previewTheme}
                    dropdownClassName="dropdown-bottom dropdown-end"
                  />
                </div>
                <div className="rounded-lg border border-base-300 bg-base-100 px-3 py-2">
                  <ThemeSelect
                    label="Thème sombre"
                    themesList={darkThemes}
                    selectedTheme={darkPreviewTheme}
                    onThemeChange={previewTheme}
                    dropdownClassName="dropdown-bottom dropdown-end"
                  />
                </div>
              </div>
            </div>

          </fieldset>

          <div className="mt-auto flex justify-end pt-5">
            <button
              type="submit"
              className="btn btn-primary min-w-32 normal-case"
              disabled={isLoading || isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Sauvegarde…" : "Sauvegarder"}
            </button>
          </div>
        </form>
        </BoxWrapper>
      </div>

      <BoxWrapper className="h-auto gap-6">
        <form
          className="flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            void save("messages");
          }}
        >
          <div>
            <h2 className="text-lg font-bold">Messages des dashboards</h2>
            <p className="text-sm text-base-content/70">
              Personnalisez les textes d’accueil affichés selon le profil de
              l’utilisateur.
            </p>
          </div>

          <fieldset
            disabled={isLoading || isSaving}
            className="grid gap-4 lg:grid-cols-3"
          >
            {messageFields.map(([role, label]) => (
              <div key={role} className="flex flex-col gap-4">
                <h3 className="text-sm font-bold">{label}</h3>
                <label className="flex flex-col gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-base-content/70">
                    Titre
                    <QuestionMarkTooltip
                      tooltipPosition="top"
                      tooltipValue="Variables disponibles : {firstname} et {lastname}."
                    />
                  </span>
                  <input
                    className="input input-bordered w-full focus:outline-none"
                    value={settings.welcomeTitles[role]}
                    maxLength={120}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        welcomeTitles: {
                          ...current.welcomeTitles,
                          [role]: event.target.value,
                        },
                      }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-base-content/70">
                    Sous-texte
                  </span>
                  <textarea
                    className="textarea textarea-bordered min-h-28 w-full resize-y focus:outline-none"
                    value={settings.welcomeMessages[role]}
                    maxLength={300}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        welcomeMessages: {
                          ...current.welcomeMessages,
                          [role]: event.target.value,
                        },
                      }))
                    }
                  />
                </label>
              </div>
            ))}
          </fieldset>

          <div className="flex justify-end pt-5">
            <button
              type="submit"
              className="btn btn-primary min-w-32 normal-case"
              disabled={isLoading || isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Sauvegarde…" : "Sauvegarder"}
            </button>
          </div>
        </form>
      </BoxWrapper>
    </div>
  );
}
