import { PropsWithChildren, ReactNode, Suspense } from "react";

type Props = {
  sidebar: ReactNode;
  loader: ReactNode;
  topbar?: ReactNode;
};

const DashboardLayout = ({
  children,
  sidebar,
  loader,
  topbar,
}: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col h-screen p-2 bg-base-100 box-border">
      <div className="flex gap-2 h-full overflow-hidden">
        {/* Sidebar */}
        <aside className="h-full z-20">{sidebar}</aside>

        <main className="overflow-y-auto w-full h-full relative">
          {/* Topbar optionnelle */}
          {topbar && <header className="sticky top-0 z-10">{topbar}</header>}

          {/* Children */}
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center">
                {loader}
              </div>
            }
          >
            <div className="flex justify-center">
              <div className="mt-[8vh] mb-[4vh] xl:w-[80%] w-[90%]">
                {children}
              </div>
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
