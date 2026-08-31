import { PropsWithChildren, ReactNode } from "react";

type Props = {
  sidebar: ReactNode;
  loader: ReactNode;
};

const AppWrapper = ({ children, sidebar }: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col h-screen p-2 bg-base-100 box-border">
      <div className="flex gap-2 h-full overflow-hidden">
        {/* Sidebar */}
        <aside className="h-full z-20">{sidebar}</aside>

        <main
          id="main-scroll-container"
          className="min-w-0 overflow-y-auto w-full h-full relative"
        >
          {/* Children */}

          <div className="flex min-w-0 justify-center">
            <div className="min-w-0 mt-[8vh] mb-[4vh] xl:w-[80%] w-[90%]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppWrapper;
