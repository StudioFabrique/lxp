import {
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { cn } from "../../../utils/cn";
import { FIRST_FIELD_SELECTOR } from "../../../hooks/useModalAutoFocus";

// Le contenu du panneau reste monté et le panneau est masqué tant que le
// drawer est fermé : le focus n'est possible qu'une fois l'ouverture effective,
// et le formulaire peut se monter légèrement après le basculement.
const FOCUS_RETRY_DELAYS_MS = [0, 50, 150, 350];

type Props = {
  children: ReactNode;
  visible?: boolean;
  title: string;
  buttonTitle?: string;
  icon?: ReactNode;
  id?: string;
  zIndex?: number;
  isOpen?: boolean;
  panelClassName?: string;
  buttonClassname?: HTMLAttributes<HTMLButtonElement>["className"];
  onCloseDrawer?: (id: string) => void;
};

const RightSideDrawer: FC<Props> = ({
  children,
  visible = true,
  title,
  buttonTitle,
  buttonClassname,
  icon,
  id = "my-drawer-4",
  zIndex = 50,
  isOpen,
  panelClassName,
  onCloseDrawer,
}) => {
  const checkboxRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const focusTimersRef = useRef<number[]>([]);

  const clearFocusTimers = useCallback(() => {
    focusTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    focusTimersRef.current = [];
  }, []);

  const focusFirstField = useCallback(() => {
    clearFocusTimers();
    focusTimersRef.current = FOCUS_RETRY_DELAYS_MS.map((delay) =>
      window.setTimeout(() => {
        const panel = panelRef.current;
        if (!panel || !checkboxRef.current?.checked) return;
        const active = document.activeElement;
        if (active && panel.contains(active)) {
          // Un champ du panneau est déjà focalisé : on s'arrête.
          if (active.matches(FIRST_FIELD_SELECTOR)) clearFocusTimers();
          return;
        }
        const field = panel.querySelector<HTMLElement>(FIRST_FIELD_SELECTOR);
        if (!field) return;
        field.focus();
        if (document.activeElement === field) clearFocusTimers();
      }, delay),
    );
  }, [clearFocusTimers]);

  const btnStyle = buttonClassname ?? cn(
    "drawer-button btn btn-sm bg-primary border-none text-base-100 hover:brightness-75 hover:bg-primary focus:outline-none",
    buttonTitle === undefined && "btn-square",
  );

  const handleCloseDrawer = () => {
    if (onCloseDrawer) {
      onCloseDrawer(id);
    } else {
      if (checkboxRef.current) {
        checkboxRef.current.checked = false;
      }
    }
  };

  useEffect(() => {
    if (isOpen !== undefined) {
      checkboxRef.current!.checked = isOpen;
      if (isOpen) focusFirstField();
    }
  }, [isOpen, focusFirstField]);

  useEffect(() => clearFocusTimers, [clearFocusTimers]);

  return (
    <div className="drawer drawer-end relative">
      <input
        id={id}
        type="checkbox"
        className="drawer-toggle"
        ref={checkboxRef}
        onChange={(event) => {
          if (event.currentTarget.checked) focusFirstField();
        }}
      />
      <div className="drawer-content sticky top-0 z-0">
        {visible ? (
          <label htmlFor={id} className={btnStyle}>
            {buttonTitle ? (
              <div className="w-fit flex items-center gap-x-2">
                {icon ?? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {buttonTitle}
              </div>
            ) : (
              (icon ?? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                </svg>
              ))
            )}
          </label>
        ) : null}
      </div>
      <div className="drawer-side h-dvh overflow-hidden" style={{ zIndex }}>
        <button
          type="button"
          aria-label="Fermer le panneau"
          onClick={handleCloseDrawer}
          className="drawer-overlay fixed top-0 left-0 w-screen h-dvh"
        />
        <div
          ref={panelRef}
          className={cn(
            "flex h-dvh w-full min-w-0 flex-col rounded-l-2xl sm:w-auto sm:min-w-[35rem] bg-base-200 text-base-content relative",
            panelClassName,
          )}
        >
          <div className="flex-shrink-0 py-4 pl-4">
            <div className="flex items-center gap-x-4">
              <button
                type="button"
                aria-label="Retour"
                className="text-primary cursor-pointer"
                onClick={handleCloseDrawer}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-primary">{title}</h2>
            </div>
            <div className="divider divider-vertical"></div>
          </div>

          <div className="scroll-fade-bottom flex-1 overflow-y-auto px-4 pb-4 [--scroll-fade-size:1rem]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default RightSideDrawer;
