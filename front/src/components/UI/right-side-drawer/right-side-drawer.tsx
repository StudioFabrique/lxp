import { FC, ReactNode, useRef } from "react";

type Props = {
  children: ReactNode;
  visible?: boolean;
  title: string;
  id?: string;
  onCloseDrawer?: (id: string) => void;
};

const RightSideDrawer: FC<Props> = ({
  children,
  visible = true,
  title,
  id = "my-drawer-4",
  onCloseDrawer,
}) => {
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  const handleCloseDrawer = () => {
    if (onCloseDrawer) {
      onCloseDrawer(id);
    } else {
      if (checkboxRef.current) {
        checkboxRef.current.checked = false;
      }
    }
  };

  const handleToggle = (event: any) => {
    if (onCloseDrawer && checkboxRef.current?.checked === false) {
      onCloseDrawer(id);
    }
  };

  return (
    <div className="h-full drawer drawer-end z-50 overflow-y-auto">
      <input
        id={id}
        type="checkbox"
        className="drawer-toggle"
        ref={checkboxRef}
        onChange={handleToggle}
      />
      <div className="drawer-content overflow-y-auto">
        {/* Page content here */}
        {visible ? (
          <label
            htmlFor={id}
            className="drawer-button btn btn-square btn-sm bg-primary border-none text-base-100 hover:brightness-75 hover:bg-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
            </svg>
          </label>
        ) : null}
      </div>
      <div className="drawer-side overflow-y-auto">
        <label
          htmlFor={id}
          className="drawer-overlay fixed top-0 left-0 w-screen min-h-screen overflow-y-auto"
        ></label>
        <ul className="block menu p-4 w-6/6 top-0 right-0 min-h-screen bg-base-200 text-base-content rounded-l-2xl">
          {/* Sidebar content here */}
          <div className="flex items-center gap-x-4 overflow-y-auto">
            <div onClick={handleCloseDrawer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <div className="divider" />
          {children}
        </ul>
      </div>
    </div>
  );
};

export default RightSideDrawer;
