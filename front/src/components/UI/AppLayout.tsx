import { PropsWithChildren, ReactNode, Suspense } from "react";
import Loader from "./loader";
import Sidebar from "./sidebar/sidebar";

type Props = {
  loader?: ReactNode;
  contentWidth?: string;
  sidebar?: ReactNode;
};

const AppLayout = ({
  children,
  loader = <Loader />,
  contentWidth = "80%",
  sidebar = <Sidebar />,
}: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col gap-2">
      <div className={`flex gap-2 h-screen`}>
        <div className="h-[98.5vh]">{sidebar}</div>
        <div className="overflow-scroll w-full">
          <Suspense fallback={loader}>
            <div className="flex justify-center">
              <div
                style={{
                  width: contentWidth,
                  marginTop: "8vh",
                  marginBottom: "4vh",
                }}
              >
                {children}
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
