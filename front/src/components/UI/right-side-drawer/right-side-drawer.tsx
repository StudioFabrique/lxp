import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const RightSideDrawer: FC<Props> = ({ children }) => {
  return (
    <div className="h-full drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label
          htmlFor="my-drawer-4"
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
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          className="drawer-overlay fixed top-0 left-0 w-screen h-full"
        ></label>
        <ul className="menu p-4 w-6/6 fixed top-0 right-0 h-screen bg-base-200 text-base-content">
          {/* Sidebar content here */}
          {children}
        </ul>
      </div>
    </div>
  );
};

export default RightSideDrawer;
