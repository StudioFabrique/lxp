import { PropsWithChildren, ReactNode, Suspense } from "react";
import Sidebar from "../sidebar/Sidebar";

type Props = {
  loader: ReactNode;
  topbar?: ReactNode;
};

export const DashboardLayout = ({
  children,
  loader,
  topbar,
}: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-base-100">
      <div className="flex h-full">
        {/* Sidebar conteneur */}
        <aside className="h-full z-20">
          <Sidebar />
        </aside>

        {/* Main Content conteneur */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
          {topbar && <header className="sticky top-0 z-10">{topbar}</header>}

          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center">
                {loader}
              </div>
            }
          >
            <div className="flex justify-center w-full px-4 py-8">
              <div className="w-full xl:w-[80%] max-w-7xl">{children}</div>
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
};
