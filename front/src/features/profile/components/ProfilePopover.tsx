import { useContext, useRef, useState, type ChangeEvent } from "react";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDownUp,
  ChartNoAxesCombined,
  EditIcon,
  Settings,
  X,
} from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { AuthContext } from "../../../store/AuthProvider";
import { ThemeContext } from "../../../store/ThemeProvider";
import { AvatarSmall } from "../../../components/avatar/AvatarSmall";
import { darkThemes, lightThemes } from "../../../config/themes";
import { avatarImageMaxSize } from "../../../config/images-sizes";
import { maxSizeError } from "../../../utils/helpers/max-size-error";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import { profileApi } from "../api/profile.api";
import ProfileEditorModal from "./ProfileEditorModal";
import ThemeSelect from "./theme-select";
import { sidebarControlClassName } from "../../../components/sidebar/sidebar-styles";

type Props = { interfaceType: string };

export default function ProfilePopover({ interfaceType }: Props) {
  const { user, handshake } = useContext(AuthContext);
  const { theme, toggleTheme, chooseTheme } = useContext(ThemeContext);
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const fullName = user
    ? `${user.firstname} ${user.lastname}`.trim()
    : "Utilisateur";
  const canManageInstance = user?.roles?.[0]?.rank === 0;
  const canSeeProgress =
    interfaceType === "student" && user?.roles?.[0]?.rank === 3;
  const canActivateSuperadmin =
    user?.roles?.[0]?.rank === 1 && user.roles[0].role === "admin";

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;
    if (
      !/^image\/(jpeg|png|gif|webp)$/.test(file.type) ||
      !/\.(jpe?g|png|gif|webp)$/i.test(file.name)
    ) {
      toast.error("Choisissez une image JPG, PNG, GIF ou WebP.");
      return;
    }
    if (file.size > avatarImageMaxSize) {
      toast.error(maxSizeError(avatarImageMaxSize));
      return;
    }

    const data = new FormData();
    data.append("image", file);
    data.append(
      "data",
      JSON.stringify({
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
      }),
    );
    setUploading(true);
    try {
      await profileApi.mutations.updateInformation(data);
      await handshake();
      toast.success("Photo de profil mise à jour.");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Impossible de modifier la photo de profil."),
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async () => {
    if (!user?.avatar || uploading || deleting) return;

    setDeleting(true);
    try {
      await profileApi.mutations.deleteAvatar();
      await handshake();
      toast.success("Photo de profil supprimée.");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Impossible de supprimer la photo de profil."),
      );
    } finally {
      setDeleting(false);
    }
  };

  const themeOptions = theme === "light" ? lightThemes : darkThemes;

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={`${sidebarControlClassName} capitalize ${open ? "bg-[var(--sidebar-hover)] ring-1 ring-[var(--sidebar-border)]" : ""}`}
            data-tip={fullName}
            aria-label={`Ouvrir le menu de ${fullName}`}
          >
            {user && (
              <AvatarSmall
                user={user}
                noImgClassName="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-content"
                imgClassName="size-6 shrink-0 rounded-full object-cover"
              />
            )}
            <span className="2xl:block hidden truncate">{fullName}</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal forceMount>
          <AnimatePresence>
            {open && (
              <Popover.Content
                asChild
                forceMount
                side="right"
                align="end"
                sideOffset={20}
                collisionPadding={12}
              >
                <motion.div
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.96, x: -6 }
                  }
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.98, x: -4 }
                  }
                  transition={{
                    duration: reduceMotion ? 0.01 : 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    transformOrigin:
                      "var(--radix-popover-content-transform-origin)",
                  }}
                  className="z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-base-300 bg-base-100 p-4 text-base-content shadow-xl outline-none"
                  aria-label="Menu du profil"
                >
                  <div className="group/profile flex items-start gap-3">
                    <div className="relative size-14 shrink-0">
                      <button
                        type="button"
                        className="group/avatar relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-transparent transition-colors group-hover/profile:ring-base-content/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading || deleting}
                        aria-label="Modifier la photo de profil"
                      >
                        {user && (
                          <AvatarSmall
                            user={user}
                            noImgClassName="flex size-14 items-center justify-center rounded-full bg-primary text-lg text-primary-content"
                            imgClassName="size-14 rounded-full object-cover"
                          />
                        )}
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-[1px] transition-opacity group-hover/avatar:opacity-100 group-focus-visible/avatar:opacity-100">
                          <EditIcon className="size-7 rounded-full bg-base-100/90 p-1.5 stroke-2 text-base-content" />
                        </span>
                      </button>
                      {user?.avatar && (
                        <button
                          type="button"
                          className="pointer-events-none absolute -right-1 -top-1 z-10 flex size-5 items-center justify-center rounded-full bg-error text-error-content opacity-0 shadow-sm transition-opacity group-hover/profile:pointer-events-auto group-hover/profile:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100"
                          onClick={() => void deleteAvatar()}
                          disabled={uploading || deleting}
                          aria-label="Supprimer la photo de profil"
                        >
                          <X className="size-3.5 stroke-[2.5]" />
                        </button>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 truncate font-semibold capitalize">
                          {fullName}
                        </p>
                        <span className="badge badge-sm shrink-0 border-primary/20 bg-primary/10 text-primary capitalize">
                          {user?.roles?.[0]?.label ?? "Rôle non défini"}
                        </span>
                      </div>
                      <p className="mt-1 break-all text-sm text-base-content/70">
                        {user?.email}
                      </p>
                      {(uploading || deleting) && (
                        <p className="sr-only" role="status">
                          {uploading
                            ? "Enregistrement de la photo…"
                            : "Suppression de la photo…"}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm mt-2 h-8 min-h-8 w-full gap-2 text-xs"
                    onClick={() => {
                      setOpen(false);
                      setEditing(true);
                    }}
                  >
                    Modifier mon profil
                  </button>
                  <div className="mt-3 border-t border-base-300 pt-3">
                    {canSeeProgress && (
                      <Link
                        to="/student/mon-avancement"
                        onClick={() => setOpen(false)}
                        className="btn btn-ghost btn-sm w-full justify-start gap-2"
                      >
                        <ChartNoAxesCombined className="size-4" /> Mon
                        avancement
                      </Link>
                    )}
                    {canActivateSuperadmin && (
                      <Link
                        to="/admin/activer-superadmin"
                        onClick={() => setOpen(false)}
                        className="btn btn-ghost btn-sm w-full justify-start gap-2"
                      >
                        <Settings className="size-4" /> Activer le rôle
                        superadmin
                      </Link>
                    )}
                    <div className="mt-2 flex min-w-0 items-center justify-between gap-1 rounded-lg bg-base-200 p-2 text-xs">
                      <span className="shrink-0">
                        Mode {theme === "light" ? "clair" : "sombre"}
                      </span>

                      <div className="flex gap-2 items-center">
                        <ThemeSelect
                          key={theme}
                          label={
                            theme === "light" ? "Thème clair" : "Thème sombre"
                          }
                          themesList={themeOptions}
                          onThemeChange={chooseTheme}
                          dropdownClassName="dropdown-top dropdown-end"
                          compact
                        />
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-square"
                          onClick={toggleTheme}
                          aria-label="Changer de mode d'affichage"
                        >
                          <ArrowDownUp className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {canManageInstance && (
                    <div className="mt-6">
                      <Link
                        to="/admin/parametres-instance"
                        onClick={() => setOpen(false)}
                        className="btn btn-outline btn-sm h-8 min-h-8 w-full gap-2 text-xs"
                      >
                        <Settings className="size-3.5 shrink-0" /> Paramètres de
                        l’instance
                      </Link>
                    </div>
                  )}
                </motion.div>
              </Popover.Content>
            )}
          </AnimatePresence>
        </Popover.Portal>
      </Popover.Root>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        onChange={(event) => void uploadAvatar(event)}
      />
      {editing && (
        <ProfileEditorModal
          onClose={() => setEditing(false)}
          onSaved={() => {
            void handshake();
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
