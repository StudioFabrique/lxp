/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, HTMLAttributes, ReactNode, useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
  visible?: boolean;
  title: string;
  buttonTitle?: string;
  icon?: ReactNode;
  id?: string;
  zIndex?: number;
  isOpen?: boolean;
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
  onCloseDrawer,
}) => {
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  const btnStyle = buttonClassname
    ? buttonClassname
    : buttonTitle !== undefined
      ? "drawer-button btn btn-sm bg-primary border-none text-neutral-content hover:brightness-75 hover:bg-primary focus:outline-none"
      : "drawer-button btn btn-square btn-sm bg-primary border-none text-neutral-content hover:brightness-75 hover:bg-primary focus:outline-none";

  const handleCloseDrawer = () => {
    if (onCloseDrawer) {
      onCloseDrawer(id);
    } else {
      if (checkboxRef.current) {
        checkboxRef.current.checked = false;
      }
    }
  };

  const handleToggle = (_event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCloseDrawer && checkboxRef.current?.checked === false) {
      onCloseDrawer(id);
    }
  };

  useEffect(() => {
    if (isOpen !== undefined) {
      checkboxRef.current!.checked = isOpen;
    }
  }, [isOpen]);

  return (
    <div className="drawer drawer-end relative">
      <input
        id={id}
        type="checkbox"
        className="drawer-toggle"
        ref={checkboxRef}
        onChange={handleToggle}
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
      {/* ✅ Appliquer le z-index ici ET créer un nouveau stacking context */}
      <div className="drawer-side h-screen overflow-hidden" style={{ zIndex }}>
        {/* ✅ Overlay avec z-index relatif au drawer-side */}
        <label
          htmlFor={!isOpen ? id : undefined}
          className="drawer-overlay fixed top-0 left-0 w-screen h-screen"
        />
        {/* ✅ Contenu du drawer - supprimer le z-[1000] et utiliser relative */}
        <div className="min-w-[35rem] flex flex-col bg-base-200 text-base-content rounded-l-2xl h-screen relative">
          {/* Header fixe */}
          <div className="flex-shrink-0 py-4 pl-4">
            <div className="flex items-center gap-x-4">
              <div
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
              </div>
              <h2 className="text-xl font-bold text-primary">{title}</h2>
            </div>
            <div className="divider divider-vertical"></div>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default RightSideDrawer;
