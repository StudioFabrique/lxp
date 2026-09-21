import { useEffect, useRef, useState } from "react";
import { Eye, Loader2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { type TemporaryImage } from "../../../components/UI/image-file-upload/image-file-upload";
import InstanceLogoControls from "../../../components/UI/instance-logo-controls";
import { INSTANCE_LOGO, INSTANCE_LOGO_COLOR } from "../../../config/urls";
import {
  darkThemes,
  defaultEnabledThemes,
  lightThemes,
  themeLabels,
} from "../../../config/themes";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import { profileApi, type InstanceSettings } from "../api/profile.api";

const emptySettings: InstanceSettings = {
  name: "",
  setupCompleted: true,
  hasLogo: false,
  enabledThemes: [...defaultEnabledThemes],
};

const defaultBackgroundColor = "#ffffff";
const validBackgroundColor = /^#[0-9a-f]{6}$/i;

export default function InstanceGeneralSettings() {
  const [settings, setSettings] = useState(emptySettings);
  const [initialSettings, setInitialSettings] = useState(emptySettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [themeDrawerMode, setThemeDrawerMode] = useState<
    "light" | "dark" | null
  >(null);
  const [previewedTheme, setPreviewedTheme] = useState<string | null>(null);
  const themeBeforePreview = useRef<string | null>(null);
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

  useEffect(() => {
    profileApi.queries
      .getInstanceSettings()
      .then((data) => {
        setSettings(data);
        setInitialSettings(data);
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

  const save = async (scope: "identity" | "interface") => {
    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append(
        "name",
        scope === "identity" ? settings.name : initialSettings.name,
      );
      payload.append(
        "enabledThemes",
        JSON.stringify(
          scope === "interface"
            ? settings.enabledThemes
            : initialSettings.enabledThemes,
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

  const toggleAvailableTheme = (
    theme: string,
    modeThemes: readonly string[],
  ) => {
    setSettings((current) => {
      const isEnabled = current.enabledThemes.includes(theme);
      const enabledInMode = modeThemes.filter((item) =>
        current.enabledThemes.includes(item),
      );
      if (isEnabled && enabledInMode.length === 1) {
        toast.error("Conservez au moins un thème dans chaque mode.");
        return current;
      }
      return {
        ...current,
        enabledThemes: isEnabled
          ? current.enabledThemes.filter((item) => item !== theme)
          : [...current.enabledThemes, theme],
      };
    });
  };

  const openThemeDrawer = (mode: "light" | "dark") => {
    themeBeforePreview.current =
      document.documentElement.getAttribute("data-theme");
    setPreviewedTheme(null);
    setThemeDrawerMode(mode);
  };

  const closeThemeDrawer = () => {
    if (themeBeforePreview.current) {
      document.documentElement.setAttribute(
        "data-theme",
        themeBeforePreview.current,
      );
    }
    themeBeforePreview.current = null;
    setPreviewedTheme(null);
    setThemeDrawerMode(null);
  };

  const previewTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    setPreviewedTheme(theme);
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

              <div className="w-full max-w-sm self-center">
                <InstanceLogoControls
                  temporaryImage={logo}
                  onSetTemporaryImage={(image) => {
                    setLogo(image);
                    setDeleteLogo(false);
                  }}
                  backgroundColor={backgroundColor}
                  onBackgroundColorChange={setBackgroundColor}
                  onPreviewAvailabilityChange={setHasLogo}
                  onRemove={
                    hasLogo && !deleteLogo
                      ? () => {
                          setLogo({ file: null, url: null });
                          setHasLogo(false);
                          setDeleteLogo(true);
                        }
                      : undefined
                  }
                  helpText="JPG ou PNG · appliqué à la sauvegarde."
                />
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
                Choisissez les thèmes accessibles à tous les utilisateurs de
                l’instance.
              </p>
            </div>

            <fieldset
              disabled={isLoading || isSaving}
              className="flex flex-col gap-5"
            >
              {(
                [
                  ["light", "Thèmes clairs", lightThemes],
                  ["dark", "Thèmes sombres", darkThemes],
                ] as const
              ).map(([mode, label, themeList]) => {
                const enabledThemes = themeList.filter((theme) =>
                  settings.enabledThemes.includes(theme),
                );
                return (
                  <section key={mode}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold">{label}</h3>
                      <span className="badge badge-ghost text-xs">
                        {enabledThemes.length} actifs
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-4">
                      {enabledThemes.map((theme) => (
                        <button
                          key={theme}
                          type="button"
                          data-theme={theme}
                          onClick={() => toggleAvailableTheme(theme, themeList)}
                          className="group flex min-w-0 items-center gap-3 rounded-xl border border-primary bg-base-300 p-3 text-left shadow-sm transition hover:-translate-y-0.5"
                        >
                          <span className="flex size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-base-content/20">
                            <span className="h-full w-1/2 bg-primary" />
                            <span className="h-full w-1/2 bg-secondary" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-base-content">
                              {themeLabels[theme] ?? theme}
                            </span>
                            <span className="text-xs text-base-content/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                              Retirer
                            </span>
                          </span>
                        </button>
                      ))}

                      <button
                        type="button"
                        aria-expanded={themeDrawerMode === mode}
                        aria-controls="theme-drawer-panel"
                        onClick={() => openThemeDrawer(mode)}
                        className="flex min-h-16 items-center justify-center gap-2 rounded-xl border border-dashed border-base-content/30 bg-base-200/50 p-3 text-sm font-semibold text-base-content/70 transition hover:border-primary hover:bg-base-200 hover:text-primary"
                      >
                        <Plus className="size-5" aria-hidden="true" />
                        Ajouter
                      </button>
                    </div>
                  </section>
                );
              })}
            </fieldset>

            <div className="drawer drawer-end">
              <input
                id="theme-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={themeDrawerMode !== null}
                readOnly
              />
              <div className="drawer-content" />
              <div className="drawer-side z-50">
                <label
                  htmlFor="theme-drawer"
                  aria-label="Fermer le sélecteur de thèmes"
                  className="drawer-overlay"
                  onClick={closeThemeDrawer}
                />
                <aside
                  id="theme-drawer-panel"
                  className="min-h-full w-full max-w-md overflow-y-auto bg-base-100 p-5 text-base-content shadow-2xl"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        Ajouter un thème{" "}
                        {themeDrawerMode === "dark" ? "sombre" : "clair"}
                      </h3>
                      <p className="mt-1 text-sm text-base-content/60">
                        Sélectionnez un thème pour le rendre accessible à tous.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-square shrink-0"
                      aria-label="Fermer le sélecteur de thèmes"
                      onClick={closeThemeDrawer}
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {themeDrawerMode &&
                    (() => {
                      const themeList =
                        themeDrawerMode === "light" ? lightThemes : darkThemes;
                      const disabledThemes = themeList.filter(
                        (theme) => !settings.enabledThemes.includes(theme),
                      );

                      return disabledThemes.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {disabledThemes.map((theme) => (
                            <article
                              key={theme}
                              data-theme={theme}
                              className={`min-w-0 rounded-xl border bg-base-100 p-3 text-left transition ${previewedTheme === theme ? "border-primary ring-2 ring-primary/25" : "border-base-300"}`}
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <span className="flex size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-base-content/20">
                                  <span className="h-full w-1/2 bg-primary" />
                                  <span className="h-full w-1/2 bg-secondary" />
                                </span>
                                <span className="block min-w-0 truncate text-sm font-semibold text-base-content">
                                  {themeLabels[theme] ?? theme}
                                </span>
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                {previewedTheme !== theme && (
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-xs gap-1 px-1 normal-case"
                                    onClick={() => previewTheme(theme)}
                                  >
                                    <Eye className="size-3.5" />
                                    Prévisualiser
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className={`btn btn-primary btn-xs normal-case ${previewedTheme === theme ? "col-span-2" : ""}`}
                                  onClick={() =>
                                    toggleAvailableTheme(theme, themeList)
                                  }
                                >
                                  Ajouter
                                </button>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-xl bg-base-200 px-4 py-8 text-center text-sm text-base-content/60">
                          Tous les thèmes sont déjà accessibles.
                        </p>
                      );
                    })()}
                </aside>
              </div>
            </div>

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

    </div>
  );
}
