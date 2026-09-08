import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AuthContext } from "../../store/AuthProvider";
import { getUserArea } from "../../utils/helpers/user-role";
import type Skill from "../../utils/interfaces/skill";
import TrophyIcon from "../UI/svg/trophy-icon.component";
import Modal from "../UI/modal/modal";
import SkillModules from "./skill-modules";

type Props = {
  skill: Skill;
  size?: "small" | "medium" | "large";
  inModal?: boolean;
  card?: boolean;
};

export default function SkillBadge({
  skill,
  size = "medium",
  inModal = false,
  card = false,
}: Props) {
  const { user } = useContext(AuthContext);
  const isStudent = getUserArea(user) === "student";
  const [isOpen, setIsOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialogContent = useRef<HTMLDivElement>(null);
  const sizeClass = { small: "size-12", medium: "size-20", large: "size-28" }[
    size
  ];
  const completed = skill.completedModules ?? 0;
  const total = skill.totalModules ?? 0;

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogContent.current?.closest("dialog");
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          "button, a[href], [tabindex='0']",
        ) ?? [],
      );
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
      }
      if (event.key === "Tab") {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const button = trigger.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      button?.focus();
    };
  }, [isOpen]);

  const visual = skill.badge ? (
    <img
      src={skill.badge}
      alt={skill.description}
      className={`${sizeClass} object-contain transition-opacity ${isStudent && !skill.isEarned ? "opacity-30" : "opacity-100"}`}
    />
  ) : (
    <span
      aria-hidden="true"
      className={`${sizeClass} block text-primary transition-opacity ${isStudent && !skill.isEarned ? "opacity-30" : "opacity-100"}`}
    >
      <TrophyIcon />
    </span>
  );
  const progress = isStudent && (
    <span className="flex w-full flex-col items-center gap-1">
      <progress
        className="progress progress-primary h-1.5 w-full"
        value={completed}
        max={total || 1}
        aria-label={`Progression du badge ${skill.description}`}
        aria-valuetext={
          total
            ? `${completed} modules terminés sur ${total}`
            : "Aucun module associé"
        }
      />
      <span className="text-xs tabular-nums text-base-content/70">
        {completed}/{total}
      </span>
    </span>
  );
  const cardClass =
    "flex w-full items-center gap-3 rounded-lg border border-base-300 bg-base-200 p-4 text-left text-base-content shadow-sm";
  const content = card ? (
    <>
      <span className="flex shrink-0 flex-col items-center gap-1">
        {visual}
        {progress}
      </span>
      <span className="first-letter:uppercase">{skill.description}</span>
    </>
  ) : (
    visual
  );

  return (
    <div
      className={card ? "w-full" : "flex shrink-0 flex-col items-center gap-1"}
    >
      {isStudent && !inModal ? (
        <button
          ref={trigger}
          type="button"
          className={`cursor-pointer ${card ? `${cardClass} transition-colors hover:bg-base-300 focus-visible:bg-base-300` : "tooltip tooltip-bottom rounded-lg"} focus-visible:outline-2 focus-visible:outline-primary`}
          data-tip={card ? undefined : skill.description}
          aria-label={`Voir les modules pour ${skill.description}`}
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
        >
          {content}
        </button>
      ) : (
        <div
          className={card ? cardClass : "tooltip tooltip-bottom"}
          data-tip={card ? undefined : skill.description}
          aria-label={skill.description}
          tabIndex={inModal || card ? undefined : 0}
        >
          {content}
        </div>
      )}
      {!card && progress}
      {isOpen &&
        createPortal(
          <Modal
            title={skill.description}
            rightLabel="Fermer"
            onRightClick={() => setIsOpen(false)}
            onMinimizeClick={() => setIsOpen(false)}
            modalBoxStyle="w-11/12 max-w-lg"
          >
            <div
              ref={dialogContent}
              className="flex flex-col items-center gap-4 py-4"
            >
              <SkillBadge skill={skill} size="large" inModal />
              <p className="font-medium">
                {skill.isEarned
                  ? "Badge obtenu"
                  : "Modules à terminer pour obtenir ce badge"}
              </p>
              <SkillModules skill={skill} onNavigate={() => setIsOpen(false)} />
            </div>
          </Modal>,
          document.body,
        )}
    </div>
  );
}
