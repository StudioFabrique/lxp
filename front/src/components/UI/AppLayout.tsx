import { PropsWithChildren, ReactNode, Suspense } from "react";
import Loader from "./loader";
import Sidebar from "./sidebar/sidebar";

type Props = {
  loader?: ReactNode;
  sidebar?: ReactNode;
};

const AppLayout = ({
  children,
  loader = <Loader />,
  sidebar = <Sidebar />,
}: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col gap-2">
      <div className={`flex gap-2 h-screen`}>
        <div className="h-[98.5vh]">{sidebar}</div>
        <div className="overflow-scroll w-full">
          <Suspense fallback={loader}>
            <div className="flex justify-center">
              <div className={`mt-[8vh] mb-[4vh] w-[80%]`}>{children}</div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
